"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { useRouter, usePathname } from "next/navigation"
import { UserPreferences, updateUserPreferences } from "@/lib/settings-actions"
import { cn } from "@/lib/utils"
import { Check, Loader2, Globe, Moon, Sun, Monitor, Coins } from "lucide-react"

interface SettingsFormProps {
  initialData: UserPreferences
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const t = useTranslations("Settings")
  const { setTheme, theme: currentTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  const [saving, setSaving] = useState(false)
  const [currency, setCurrency] = useState(initialData.currency)
  const [language, setLanguage] = useState(initialData.language)
  const [themePreference, setThemePreference] = useState(initialData.theme)

  const handleSave = async (updates: Partial<UserPreferences>) => {
    setSaving(true)
    const res = await updateUserPreferences(updates)
    if (res.success) {
      if (updates.language && updates.language !== initialData.language) {
        // Handle language change by redirecting to the new locale path
        const segments = pathname.split('/')
        segments[1] = updates.language
        router.push(segments.join('/'))
      }
      if (updates.theme) {
        setTheme(updates.theme)
      }
    }
    setSaving(false)
  }

  const currencies = [
    { code: 'SEK', name: 'Swedish Krona' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'NOK', name: 'Norwegian Krone' },
    { code: 'DKK', name: 'Danish Krone' },
  ]

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Currency Section */}
      <section className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-secondary/20 rounded-2xl text-primary">
            <Coins className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold tracking-tight">{t("currency")}</h3>
            <p className="text-sm text-muted-foreground">{t("currencyDescription")}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              onClick={() => {
                setCurrency(curr.code)
                handleSave({ currency: curr.code })
              }}
              disabled={saving}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all text-center",
                currency === curr.code
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-secondary/20 hover:border-secondary/50 text-muted-foreground"
              )}
            >
              <span className="text-lg font-black">{curr.code}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{curr.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Language Section */}
      <section className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-secondary/20 rounded-2xl text-primary">
            <Globe className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold tracking-tight">{t("language")}</h3>
            <p className="text-sm text-muted-foreground">{t("languageDescription")}</p>
          </div>
        </div>

        <div className="flex bg-secondary/20 p-1 rounded-2xl gap-1 overflow-hidden">
          {['en', 'sv'].map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setLanguage(lang)
                handleSave({ language: lang })
              }}
              disabled={saving}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all",
                language === lang
                  ? "bg-white dark:bg-charcoal shadow-sm text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {lang === 'en' ? 'English' : 'Svenska'}
              {language === lang && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </section>

      {/* Theme Section */}
      <section className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-secondary/20 rounded-2xl text-primary">
            <Sun className="h-6 w-6 dark:hidden" />
            <Moon className="h-6 w-6 hidden dark:block" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold tracking-tight">{t("theme")}</h3>
            <p className="text-sm text-muted-foreground">{t("themeDescription")}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', icon: Sun, label: t("light") },
            { id: 'dark', icon: Moon, label: t("dark") },
            { id: 'system', icon: Monitor, label: t("system") }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                setThemePreference(mode.id)
                handleSave({ theme: mode.id })
              }}
              disabled={saving}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2",
                themePreference === mode.id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-secondary/20 hover:border-secondary/50 text-muted-foreground"
              )}
            >
              <mode.icon className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-widest">{mode.label}</span>
            </button>
          ))}
        </div>
      </section>

      {saving && (
        <div className="fixed bottom-8 right-8 bg-primary text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-bold">{t("saveSuccess")}</span>
        </div>
      )}
    </div>
  )
}
