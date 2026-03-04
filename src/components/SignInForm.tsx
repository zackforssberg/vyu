"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"

interface SignInFormProps {
  labels: {
    emailLabel: string
    emailPlaceholder: string
    passwordLabel: string
    passwordPlaceholder: string
    sendMagicLink: string
    loginWithPassword: string
    useMagicLink: string
  }
}

export function SignInForm({ labels }: SignInFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState<"magic" | "password">("password")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      if (mode === "magic") {
        const result = await signIn("resend", {
          email,
          callbackUrl: window.location.href,
          redirect: false,
        })

        if (result?.error) {
          setError(result.error)
        } else {
          setSuccess(true)
        }
      } else {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          setError("Invalid email or password")
        } else {
          // Success! NextAuth will handle the session
          window.location.href = `/${window.location.pathname.split('/')[1] || 'en'}/dashboard`
        }
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (success && mode === "magic") {
    return (
      <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-primary/5 border border-primary/20 w-full max-w-sm animate-in fade-in zoom-in duration-300">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <p className="font-bold text-primary">Check your email!</p>
        <p className="text-sm text-center text-foreground/60">A sign-in link has been sent to <b>{email}</b>.</p>
        <button
          onClick={() => {
            setSuccess(false)
            setMode("magic")
          }}
          className="text-xs font-bold text-primary hover:underline uppercase tracking-widest mt-2"
        >
          Try another email
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <div className="flex flex-col items-start gap-1">
          <label htmlFor="email" className="text-sm font-medium text-foreground/80">
            {labels.emailLabel}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={labels.emailPlaceholder}
            required
            className="w-full h-11 px-4 rounded-xl border border-primary/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
          />
        </div>

        {mode === "password" && (
          <div className="flex flex-col items-start gap-1">
            <label htmlFor="password" title={labels.passwordLabel} className="text-sm font-medium text-foreground/80">
              {labels.passwordLabel}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={labels.passwordPlaceholder}
              required
              className="w-full h-11 px-4 rounded-xl border border-primary/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
            />
          </div>
        )}

        {error && (
          <p className="text-xs text-red-500 font-medium">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-11 px-8 rounded-xl bg-primary text-white font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? "..." : mode === "magic" ? labels.sendMagicLink : labels.loginWithPassword}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode(mode === "magic" ? "password" : "magic")
          setError(null)
        }}
        className="text-xs font-bold text-primary/60 hover:text-primary transition-colors"
      >
        {mode === "magic" ? labels.loginWithPassword : labels.useMagicLink}
      </button>
    </div>
  )
}
