"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { CategoryBudget, deleteBudget } from "@/lib/budget-actions"
import { formatCurrency } from "@/lib/currency"
import { cn } from "@/lib/utils"
import { Edit2, Trash2, AlertCircle, TrendingUp } from "lucide-react"
import { AddBudgetForm } from "./AddBudgetForm"

interface BudgetCardProps {
  budget: CategoryBudget
  currency: string
}

export function BudgetCard({ budget, currency }: BudgetCardProps) {
  const t = useTranslations("Dashboard")
  const commonT = useTranslations("Transactions")
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const percentage = budget.limit_amount > 0 ? Math.min((budget.spent / budget.limit_amount) * 100, 100) : 0
  const isOver = budget.spent > budget.limit_amount && budget.limit_amount > 0
  const isApproaching = budget.spent > budget.limit_amount * 0.8 && !isOver
  const remaining = budget.limit_amount - budget.spent

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this budget limit?")) return
    setIsDeleting(true)
    const res = await deleteBudget(budget.id)
    if (!res.success) {
      alert(res.error)
      setIsDeleting(false)
    }
  }

  if (isEditing) {
    return (
      <AddBudgetForm
        initialData={{
          id: budget.id,
          category_id: budget.category_id || null,
          limit_amount: budget.limit_amount
        }}
        onSuccess={() => setIsEditing(false)}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <div className={cn(
      "relative overflow-hidden bg-card border border-border rounded-3xl p-6 shadow-sm group transition-all duration-300 hover:shadow-md",
      isDeleting && "opacity-50 grayscale pointer-events-none"
    )}>
      {/* Background Icon */}
      <TrendingUp className="absolute -right-4 -bottom-4 h-32 w-32 text-secondary/5 rotate-12" />

      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              {budget.category_name || "Total Budget"}
            </h3>
            {isOver && (
              <div className="flex items-center gap-1 text-[10px] font-black uppercase bg-coral/10 text-coral px-2 py-0.5 rounded-full">
                <AlertCircle className="h-3 w-3" />
                Over Limit
              </div>
            )}
            {isApproaching && (
              <div className="flex items-center gap-1 text-[10px] font-black uppercase bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-full">
                <AlertCircle className="h-3 w-3" />
                Approaching
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-secondary/20 rounded-xl transition-all text-muted-foreground hover:text-primary"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-coral/20 rounded-xl transition-all text-muted-foreground hover:text-coral"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="flex flex-col">
              <span className="text-3xl font-black tracking-tight text-primary">
                {formatCurrency(budget.limit_amount, currency)}
              </span>
              <span className="text-xs font-bold text-muted-foreground">
                {t("spentOf", {
                  spent: formatCurrency(budget.spent, currency),
                  limit: formatCurrency(budget.limit_amount, currency)
                })}
              </span>
            </div>

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
          </div>

          {/* Progress Bar */}
          <div className="h-4 w-full bg-secondary/20 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-1000 ease-out rounded-full",
                isOver ? "bg-coral shadow-[0_0_10px_rgba(255,131,96,0.5)]" :
                isApproaching ? "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" :
                "bg-primary"
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
