"use server"

import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "@/auth"

export async function signInAction(provider?: string) {
  return await nextAuthSignIn(provider)
}

export async function signOutAction() {
  return await nextAuthSignOut()
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// We use the service role key to bypass RLS for registration
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  db: { schema: "next_auth" }
})

export async function signUp(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!name || !email || !password) {
    return { error: "Missing required fields" }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle()

  if (existingUser) {
    return { error: "User already exists" }
  }

  // Create user
  const { data: user, error } = await supabase
    .from("users")
    .insert({
      name,
      email,
      password: hashedPassword,
    })
    .select()
    .single()

  if (error) {
    console.error("Signup error:", error)
    return { error: "Failed to create user" }
  }

  return { success: true }
}

export async function requestPasswordReset(email: string, locale: string = "en") {
  // Check if user exists
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle()

  if (!user) {
    console.log(`Password reset requested for non-existent user: ${email}`)
    // We return success anyway for security (so people can't fish for emails)
    return { success: true }
  }

  console.log(`Generating reset token for user: ${email}`)
  // Generate token
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  const expires = new Date(Date.now() + 3600000) // 1 hour

  // Store token
  const { error: tokenError } = await supabase
    .from("verification_tokens")
    .insert({
      identifier: email,
      token,
      expires: expires.toISOString(),
    })

  if (tokenError) {
    console.error("Token error:", tokenError)
    return { error: "Failed to generate reset link" }
  }

  // Send email via Resend
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/${locale}/reset-password?token=${token}`
  console.log(`Sending reset email to: ${email} with URL: ${resetUrl}`)

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AUTH_RESEND_KEY}`,
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: locale === "sv" ? "Återställ ditt lösenord" : "Reset your password",
      html: `
        <p>${locale === "sv" ? "Klicka på länken nedan för att återställa ditt lösenord:" : "Click the link below to reset your password:"}</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    }),
  })

  const resData = await res.json()
  console.log("Resend API Response:", resData)

  if (!res.ok) {
    console.error("Resend error:", resData)
    return { error: "Failed to send email" }
  }

  return { success: true }
}

export async function resetPassword(token: string, password: string) {
  // 1. Verify token
  const { data: vt, error: fetchError } = await supabase
    .from("verification_tokens")
    .select("*")
    .eq("token", token)
    .maybeSingle()

  if (fetchError || !vt) {
    return { error: "Invalid or expired token" }
  }

  if (new Date(vt.expires) < new Date()) {
    return { error: "Token has expired" }
  }

  // 2. Hash new password
  const hashedPassword = await bcrypt.hash(password, 10)

  // 3. Update user
  const { error: updateError } = await supabase
    .from("users")
    .update({ password: hashedPassword })
    .eq("email", vt.identifier)

  if (updateError) {
    console.error("Update error:", updateError)
    return { error: "Failed to update password" }
  }

  // 4. Delete token
  await supabase
    .from("verification_tokens")
    .delete()
    .eq("token", token)

  return { success: true }
}
