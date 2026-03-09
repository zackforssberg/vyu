"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { addTransaction, updateTransaction, TransactionType, TransactionData } from "@/lib/transaction-actions"
import { getCategories, addCategory, Category } from "@/lib/category-actions"
import { cn } from "@/lib/utils"
import { Loader2, Plus, X } from "lucide-react"

import { CategoryDropdown } from "./CategoryDropdown"

interface AddTransactionFormProps {
  initialData?: TransactionData & { id: string }
  onSuccess?: () => void
  onCancel?: () => void
}

export function AddTransactionForm({ initialData, onSuccess, onCancel }: AddTransactionFormProps) {
  const t = useTranslations("Transactions")
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(!!initialData)
  const [type, setType] = useState<TransactionType>(initialData?.type || 'expense')
  const [amount, setAmount] = useState(initialData?.amount.toString() || "")
  const [categoryName, setCategoryName] = useState(initialData?.category || "")
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [date, setDate] = useState(initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0])

  const [categories, setCategories] = useState<Category[]>([])
  const [fetchingCategories, setFetchingCategories] = useState(false)
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")

  const loadCategories = async () => {
    setFetchingCategories(true)
    const res = await getCategories()
    if (res.success && res.data) {
      setCategories(res.data)
      // Set default category if none selected
      if (!initialData && !categoryId) {
        const filtered = res.data.filter(c => c.type === type || c.type === 'both')
        if (filtered.length > 0) {
          setCategoryId(filtered[0].id)
          setCategoryName(filtered[0].name)
        }
      }
    }
    setFetchingCategories(false)
  }

  useEffect(() => {
    loadCategories()
  }, [type, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let finalCategoryId = categoryId
      let finalCategoryName = categoryName

      if (showNewCategoryInput && newCategoryName) {
        const catRes = await addCategory({
          name: newCategoryName,
          type: type === 'income' ? 'income' : 'expense'
        })
        if (catRes.success && catRes.data) {
          finalCategoryId = catRes.data.id
          finalCategoryName = catRes.data.name
          // Refresh categories list for future use
          await loadCategories()
        } else {
          alert("Error creating category: " + (catRes.error || "Unknown error"))
          setLoading(false)
          return
        }
      }

      const payload: TransactionData = {
        amount: parseFloat(amount),
        type,
        category: finalCategoryName,
        category_id: finalCategoryId,
        description,
        date: new Date(date).toISOString()
      }

      const result = initialData
        ? await updateTransaction(initialData.id, payload)
        : await addTransaction(payload)

      if (result.success) {
        if (!initialData) {
          setAmount("")
          setDescription("")
          setIsOpen(false)
          setShowNewCategoryInput(false)
          setNewCategoryName("")
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
        {t("addTransaction")}
      </button>
    )
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-xl animate-in zoom-in-95 duration-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex bg-secondary p-1 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
              type === 'expense' ? "bg-white dark:bg-charcoal shadow-sm text-coral" : "text-muted-foreground"
            )}
          >
            {t("expense")}
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
              type === 'income' ? "bg-white dark:bg-charcoal shadow-sm text-primary" : "text-muted-foreground"
            )}
          >
            {t("income")}
          </button>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">
            {t("amount")}
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

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">
            {t("category")}
          </label>
          <CategoryDropdown
            value={categoryId}
            categories={categories}
            type={type}
            fetching={fetchingCategories}
            onChange={(id, name) => {
              setCategoryId(id)
              setCategoryName(name)
              setShowNewCategoryInput(false)
            }}
            onAddNew={() => {
              setShowNewCategoryInput(true)
              setCategoryId("")
              setCategoryName("")
            }}
            onDeleteSuccess={() => loadCategories()}
          />
        </div>

        {showNewCategoryInput && (
          <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">
              {t("newCategoryName")}
            </label>
            <div className="flex gap-2">
              <input
                required
                type="text"
                value={newCategoryName}
                onChange={(e) => {
                  setNewCategoryName(e.target.value)
                  setCategoryName(e.target.value)
                }}
                placeholder="e.g. Subscriptions"
                className="flex-1 bg-white dark:bg-charcoal border-border rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/20 transition-all font-bold"
              />
              <button
                type="button"
                onClick={() => setShowNewCategoryInput(false)}
                className="px-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">
            {t("description")}
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full bg-white dark:bg-charcoal border-border rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/20 transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">
            {t("date")}
          </label>
          <input
            required
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-white dark:bg-charcoal border-border rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/20 transition-all font-bold"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              onCancel?.()
            }}
            className="flex-1 py-3 font-bold text-white bg-secondary rounded-xl hover:bg-secondary/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {t("cancel")}
          </button>
          <button
            disabled={loading}
            type="submit"
            className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {initialData ? t("save") : t("save")}
          </button>
        </div>
      </form>
    </div>
  )
}
