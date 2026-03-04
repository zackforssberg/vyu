"use client"

import { useState } from "react"
import { requestPasswordReset } from "@/lib/auth-actions"
import { useParams } from "next/navigation"

interface ForgotPasswordFormProps {
  labels: {
    resetPassword: string
    emailLabel: string
    emailPlaceholder: string
    sendResetLink: string
    checkResetEmail: string
  }
}

export function ForgotPasswordForm({ labels }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const params = useParams()
  const locale = (params?.locale as string) || "en"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const result = await requestPasswordReset(email, locale)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="flex flex-col gap-4 w-full p-6 rounded-2xl bg-primary/5 border border-primary/10 animate-in fade-in zoom-in-95 duration-300">
        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold">{labels.resetPassword}</h3>
        <p className="text-foreground/70">{labels.checkResetEmail}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="reset-email" className="text-sm font-bold text-foreground/60 ml-1">
            {labels.emailLabel}
          </label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={labels.emailPlaceholder}
            required
            className="h-12 px-4 rounded-xl bg-primary/5 border border-primary/10 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-14 w-full rounded-2xl bg-primary text-white font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100 flex items-center justify-center"
        >
          {loading ? (
            <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            labels.sendResetLink
          )}
        </button>
      </form>
    </div>
  )
}
