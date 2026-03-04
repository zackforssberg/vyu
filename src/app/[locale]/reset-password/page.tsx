"use client"

import { useState, use } from "react"
import { useTranslations } from "next-intl"
import { resetPassword } from "@/lib/auth-actions"
import { useRouter, useSearchParams } from "next/navigation"
import { ThemeLanguageToggle } from "@/components/ThemeLanguageToggle"

export default function ResetPasswordPage() {
  const t = useTranslations("Index")
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      setError("Token is missing")
      return
    }

    if (password !== confirmPassword) {
      setError(t("passwordsDoNotMatch"))
      return
    }

    setLoading(true)
    setError(null)

    const result = await resetPassword(token, password)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push("/")
      }, 3000)
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground transition-colors duration-300 px-6">
      <ThemeLanguageToggle />

      <main className="flex flex-col items-center gap-8 text-center w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col items-center gap-4 mb-4">
          <div className="bg-primary/10 px-4 py-1 rounded-full text-primary text-sm font-bold uppercase tracking-wider">
            Vyu
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            {t("resetPassword")}
          </h1>
          <p className="text-foreground/70">
            {t("enterNewPassword")}
          </p>
        </div>

        {success ? (
          <div className="flex flex-col gap-4 w-full p-6 rounded-2xl bg-primary/5 border border-primary/10 animate-in fade-in zoom-in-95 duration-300">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-bold text-lg text-primary">{t("passwordResetSuccess")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-sm font-bold text-foreground/60 ml-1">
                {t("newPasswordLabel")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-12 px-4 rounded-xl bg-primary/5 border border-primary/10 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-sm font-bold text-foreground/60 ml-1">
                {t("confirmPasswordLabel")}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-12 px-4 rounded-xl bg-primary/5 border border-primary/10 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium">
                {error}
              </p>
            )}

            {!token && (
              <p className="text-red-500 text-sm font-medium">
                Token is missing. Please check your email link.
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !token}
              className="h-14 w-full rounded-2xl bg-primary text-white font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100 flex items-center justify-center mt-2"
            >
              {loading ? (
                <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                t("resetPassword")
              )}
            </button>
          </form>
        )}
      </main>
    </div>
  )
}
