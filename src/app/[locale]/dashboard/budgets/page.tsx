"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { getCategoryBudgets, CategoryBudget } from "@/lib/budget-actions"
import { getUserPreferences } from "@/lib/settings-actions"
import { BudgetCard } from "@/components/dashboard/BudgetCard"
import { AddBudgetForm } from "@/components/dashboard/AddBudgetForm"
import { Plus, PiggyBank, Loader2 } from "lucide-react"

export default function BudgetsPage() {
  const t = useTranslations("Dashboard")
  const [budgets, setBudgets] = useState<CategoryBudget[]>([])
  const [currency, setCurrency] = useState("SEK")
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

  const loadData = async () => {
    setLoading(true)
    const [budgetRes, prefsRes] = await Promise.all([
      getCategoryBudgets(),
      getUserPreferences()
    ])

    if (budgetRes.success && budgetRes.data) {
      setBudgets(budgetRes.data)
    }
    if (prefsRes.success) {
      setCurrency(prefsRes.data.currency)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight text-primary">
            {t("budgets")}
          </h1>
          <p className="text-muted-foreground font-medium">
            Plan your spending and track your progress across categories.
          </p>
        </div>

        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="h-5 w-5" />
            {t("addBudget")}
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="max-w-xl">
          <AddBudgetForm
            onSuccess={() => {
              setShowAddForm(false)
              loadData()
            }}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-bold animate-pulse">Loading budgets...</p>
        </div>
      ) : budgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-[40px] text-center space-y-4">
          <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
            <PiggyBank className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black tracking-tight">No budgets set yet</h2>
            <p className="text-muted-foreground max-w-xs mx-auto">
              Start by setting a total monthly budget or limits for specific categories.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-8 py-3 bg-secondary text-primary font-bold rounded-2xl hover:scale-105 transition-all"
          >
            {t("addBudget")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              currency={currency}
            />
          ))}
        </div>
      )}
    </div>
  )
}
