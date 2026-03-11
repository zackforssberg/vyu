"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Edit2, Check, X, TrendingUp, AlertCircle } from "lucide-react"
import { updateBudget, getBudgetProgress } from "@/lib/budget-actions"
import { getUserPreferences } from "@/lib/settings-actions"
import { formatCurrency } from "@/lib/currency"
import { cn } from "@/lib/utils"

export function BudgetTracker() {
  const t = useTranslations("Dashboard")
  const [spent, setSpent] = useState(0)
  const [limit, setLimit] = useState(0)
  const [currency, setCurrency] = useState("SEK")
  const [isEditing, setIsEditing] = useState(false)
  const [newLimit, setNewLimit] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    const [progressRes, prefsRes] = await Promise.all([
      getBudgetProgress(),
      getUserPreferences()
    ])

    if (progressRes.success) {
      setSpent(progressRes.spent)
      setLimit(progressRes.limit)
      setNewLimit(progressRes.limit.toString())
    }

    if (prefsRes.success) {
      setCurrency(prefsRes.data.currency)
    }

    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSave = async () => {
    const amount = parseFloat(newLimit)
    if (isNaN(amount) || amount < 0) return

    setSaving(true)
    const res = await updateBudget(amount)
    if (res.success) {
      setLimit(amount)
      setIsEditing(false)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="w-full h-32 bg-secondary/10 rounded-3xl animate-pulse" />
    )
  }

  const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
  const isOver = spent > limit && limit > 0
  const remaining = limit - spent

  return (
    <div className="relative overflow-hidden bg-card border border-border rounded-3xl p-6 shadow-sm group">
      {/* Background Icon */}
      <TrendingUp className="absolute -right-4 -bottom-4 h-32 w-32 text-secondary/5 rotate-12" />

      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              {t("monthlyBudget")}
            </h3>
            {isOver && (
              <div className="flex items-center gap-1 text-[10px] font-black uppercase bg-coral/10 text-coral px-2 py-0.5 rounded-full">
                <AlertCircle className="h-3 w-3" />
                Over Limit
              </div>
            )}
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-secondary/20 rounded-xl transition-all text-muted-foreground hover:text-primary"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="p-2 hover:bg-primary/20 rounded-xl transition-all text-primary"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 hover:bg-coral/20 rounded-xl transition-all text-coral"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  autoFocus
                  className="bg-secondary/20 border-none outline-none rounded-lg px-2 py-1 text-2xl font-black text-primary w-32"
                />
                <span className="text-xl font-bold opacity-50">{currency}</span>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tight text-primary">
                  {formatCurrency(limit, currency)}
                </span>
                <span className="text-xs font-bold text-muted-foreground">
                  {t("spentOf", {
                    spent: formatCurrency(spent, currency),
                    limit: formatCurrency(limit, currency)
                  })}
                </span>
              </div>
            )}

            {!isEditing && (
              <div className={cn(
                "text-right",
                isOver ? "text-coral" : "text-teal-600 dark:text-teal-400"
              )}>
                <span className="block text-lg font-black tracking-tight">
                  {formatCurrency(Math.abs(remaining), currency)}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-70">
                  {isOver ? t("budgetOver", { amount: "" }) : t("budgetRemaining", { amount: "" })}
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="h-3 w-full bg-secondary/20 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-1000 ease-out rounded-full",
                isOver ? "bg-coral shadow-[0_0_10px_rgba(255,131,96,0.5)]" : "bg-primary"
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
