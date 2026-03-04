"use client"

import { useState } from "react"
import { signUp } from "@/lib/auth-actions"

interface SignUpFormProps {
  labels: {
    createAccount: string
    nameLabel: string
    namePlaceholder: string
    emailLabel: string
    emailPlaceholder: string
    passwordLabel: string
    passwordPlaceholder: string
    signup: string
  }
  onSuccess?: () => void
}

export function SignUpForm({ labels, onSuccess }: SignUpFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("email", email)
      formData.append("password", password)

      const result = await signUp(formData)

      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        if (onSuccess) {
          setTimeout(onSuccess, 2000)
        }
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-green-500/5 border border-green-500/20 w-full max-w-sm animate-in fade-in zoom-in duration-300">
        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <p className="font-bold text-green-500">Account created!</p>
        <p className="text-sm text-center text-foreground/60">Redirecting to login...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
      <h2 className="text-2xl font-bold text-center mb-2">{labels.createAccount}</h2>

      <div className="flex flex-col items-start gap-1">
        <label htmlFor="signUpName" className="text-sm font-medium text-foreground/80">
          {labels.nameLabel}
        </label>
        <input
          id="signUpName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={labels.namePlaceholder}
          required
          className="w-full h-11 px-4 rounded-xl border border-primary/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
        />
      </div>

      <div className="flex flex-col items-start gap-1">
        <label htmlFor="signUpEmail" className="text-sm font-medium text-foreground/80">
          {labels.emailLabel}
        </label>
        <input
          id="signUpEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={labels.emailPlaceholder}
          required
          className="w-full h-11 px-4 rounded-xl border border-primary/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
        />
      </div>

      <div className="flex flex-col items-start gap-1">
        <label htmlFor="signUpPassword" className="text-sm font-medium text-foreground/80">
          {labels.passwordLabel}
        </label>
        <input
          id="signUpPassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={labels.passwordPlaceholder}
          required
          minLength={8}
          className="w-full h-11 px-4 rounded-xl border border-primary/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="h-11 px-8 rounded-xl bg-primary text-white font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100"
      >
        {loading ? "..." : labels.signup}
      </button>
    </form>
  )
}
