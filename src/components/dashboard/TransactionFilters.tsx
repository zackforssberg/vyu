"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Search, X, Calendar, Filter, Tag, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { getCategories, Category } from "@/lib/category-actions"

export function TransactionFilters() {
  const t = useTranslations("Transactions")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [type, setType] = useState(searchParams.get("type") || "all")
  const [categoryId, setCategoryId] = useState(searchParams.get("category_id") || "")
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "")
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "")

  useEffect(() => {
    async function loadCategories() {
      const res = await getCategories()
      if (res.success && res.data) {
        setCategories(res.data)
      }
    }
    loadCategories()
  }, [])

  // Debounced search update
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ search })
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch("")
    setType("all")
    setCategoryId("")
    setStartDate("")
    setEndDate("")
    router.push(pathname)
  }

  return (
    <div className="space-y-4 bg-card border border-border rounded-3xl p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full bg-secondary/20 border-border rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 ring-primary/20 transition-all font-medium"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary/40 rounded-full transition-all"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Category Filter */}
          <div className="relative flex items-center bg-secondary/20 rounded-xl px-4 border border-transparent focus-within:border-primary/20 transition-all">
            <Tag className="h-4 w-4 text-muted-foreground mr-2" />
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value)
                updateFilters({ category_id: e.target.value })
              }}
              className="bg-transparent py-3 outline-none text-xs font-bold uppercase tracking-wider appearance-none cursor-pointer pr-8"
            >
              <option value="">{t("category")}</option>
              {categories
                .filter(c => type === 'all' || c.type === type || c.type === 'both')
                .map((cat) => (
                  <option key={cat.id} value={cat.id} className="text-foreground bg-card">
                    {cat.name}
                  </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 h-3 w-3 text-muted-foreground pointer-events-none" />
          </div>

          {/* Type Filter */}
          <div className="flex bg-secondary/20 p-1 rounded-xl gap-1">
          {['all', 'expense', 'income'].map((opt) => (
            <button
              key={opt}
              onClick={() => {
                setType(opt)
                updateFilters({ type: opt === 'all' ? "" : opt })
              }}
              className={cn(
                "flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                type === opt
                  ? "bg-white dark:bg-charcoal shadow-sm text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {opt === 'all' ? t("allTypes") : t(opt)}
            </button>
          ))}
        </div>
      </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-border/50">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-secondary/10 px-3 py-2 rounded-xl border border-border/50">
            <span className="text-[10px] font-black uppercase text-muted-foreground">From</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value)
                updateFilters({ startDate: e.target.value })
              }}
              className="bg-transparent outline-none text-xs font-bold uppercase"
            />
            <span className="text-muted-foreground text-xs font-bold px-1">→</span>
            <span className="text-[10px] font-black uppercase text-muted-foreground">To</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value)
                updateFilters({ endDate: e.target.value })
              }}
              className="bg-transparent outline-none text-xs font-bold uppercase"
            />
          </div>
        </div>

        <button
          onClick={clearFilters}
          className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors px-4 py-2"
        >
          <X className="h-3.5 w-3.5" />
          {t("clearFilters")}
        </button>
      </div>
    </div>
  )
}
