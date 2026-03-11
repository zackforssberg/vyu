"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { upsertBudget } from "@/lib/budget-actions"
import { getCategories, Category } from "@/lib/category-actions"
import { cn } from "@/lib/utils"
import { Loader2, Plus, X, ChevronDown } from "lucide-react"
import { CategoryDropdown } from "./CategoryDropdown"

interface AddBudgetFormProps {
  initialData?: {
    id: string
    category_id: string | null
    limit_amount: number
  }
  onSuccess?: () => void
  onCancel?: () => void
}

export function AddBudgetForm({ initialData, onSuccess, onCancel }: AddBudgetFormProps) {
  const t = useTranslations("Dashboard")
  const commonT = useTranslations("Transactions")
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(!!initialData)
  const [amount, setAmount] = useState(initialData?.limit_amount.toString() || "")
  const [categoryId, setCategoryId] = useState<string | null>(initialData?.category_id || null)
  const [categoryName, setCategoryName] = useState("")

  const [categories, setCategories] = useState<Category[]>([])
  const [fetchingCategories, setFetchingCategories] = useState(false)

  const loadCategories = async () => {
    setFetchingCategories(true)
    const res = await getCategories()
    if (res.success && res.data) {
      // Only show expense categories for budgeting
      setCategories(res.data.filter(c => c.type === 'expense' || c.type === 'both'))
      if (initialData?.category_id) {
        const cat = res.data.find(c => c.id === initialData.category_id)
        if (cat) setCategoryName(cat.name)
      }
    }
    setFetchingCategories(false)
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await upsertBudget(parseFloat(amount), categoryId)
      if (result.success) {
        if (!initialData) {
          setAmount("")
          setCategoryId(null)
          setCategoryName("")
          setIsOpen(false)
        }
        onSuccess?.()
      } else {
        alert(result.error)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
      >
        <Plus className="h-5 w-5" />
        {t("addBudget")}
      </button>
    )
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-xl animate-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black tracking-tight text-primary">
          {initialData ? t("editBudget") : t("addBudget")}
        </h3>
        <button
          onClick={() => {
            setIsOpen(false)
            onCancel?.()
          }}
          className="p-2 hover:bg-secondary/50 rounded-xl transition-all"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">
            {initialData && !categoryId ? "Total Budget" : commonT("category")}
          </label>
          <CategoryDropdown
            disabled={!!initialData} // Don't allow changing category on edit
            value={categoryId || ""}
            categories={categories}
            type="expense"
            fetching={fetchingCategories}
            onAddNew={() => {}}
            onChange={(id, name) => {
              setCategoryId(id)
              setCategoryName(name)
            }}
            placeholder="Select a category or leave for total"
          />
          {!categoryId && !initialData && (
            <p className="text-[10px] text-muted-foreground pl-1 italic">
              Leave empty to set a total budget
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">
            {commonT("amount")}
          </label>
          <input
            required
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-white dark:bg-charcoal border-border rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/20 transition-all font-black text-xl"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setIsOpen(false)
              onCancel?.()
            }}
            className="flex-1 py-3 font-bold text-white bg-secondary rounded-xl hover:bg-secondary/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {commonT("cancel")}
          </button>
          <button
            disabled={loading}
            type="submit"
            className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {initialData ? commonT("save") : t("addBudget")}
          </button>
        </div>
      </form>
    </div>
  )
}
