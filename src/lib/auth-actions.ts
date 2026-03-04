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
