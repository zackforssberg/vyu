"use client"

import { useState, useRef, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Category, deleteCategory } from "@/lib/category-actions"
import { cn } from "@/lib/utils"
import {
  ChevronDown,
  Search,
  Trash2,
  Plus,
  X,
  Utensils,
  Car,
  Home,
  Play,
  ShoppingBag,
  Heart,
  Zap,
  Plane,
  Book,
  Wallet,
  Laptop,
  Gift,
  TrendingUp,
  MoreHorizontal
} from "lucide-react"

const IconMap: { [key: string]: any } = {
  Utensils,
  Car,
  Home,
  Play,
  ShoppingBag,
  Heart,
  Zap,
  Plane,
  Book,
  Wallet,
  Laptop,
  Gift,
  TrendingUp,
  MoreHorizontal
}

interface CategoryDropdownProps {
  value: string
  onChange: (id: string, name: string) => void
  categories: Category[]
  type: 'income' | 'expense'
  onAddNew: () => void
  fetching?: boolean
  onDeleteSuccess?: () => void
}

export function CategoryDropdown({
  value,
  onChange,
  categories,
  type,
  onAddNew,
  fetching,
  onDeleteSuccess
}: CategoryDropdownProps) {
  const t = useTranslations("Transactions")
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedCategory = categories.find(c => c.id === value)
  const filteredCategories = categories.filter(c =>
    (c.type === type || c.type === 'both') &&
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm(t("confirmDelete"))) {
      const res = await deleteCategory(id)
      if (res.success) {
        onDeleteSuccess?.()
      } else {
        alert(res.error)
      }
    }
  }

  const SelectedIcon = selectedCategory?.icon ? IconMap[selectedCategory.icon] : MoreHorizontal

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={fetching}
        className="w-full bg-white dark:bg-charcoal border border-border rounded-xl px-4 py-3 flex items-center justify-between text-left focus:ring-2 ring-primary/20 transition-all font-bold disabled:opacity-50"
      >
        <div className="flex items-center gap-3">
          {selectedCategory && (
            <div className="w-8 h-8 rounded-lg bg-secondary/30 flex items-center justify-center text-primary">
              <SelectedIcon className="h-4 w-4" />
            </div>
          )}
          <span>{selectedCategory?.name || (fetching ? "Loading..." : t("category"))}</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-all", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-charcoal border border-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xl bg-opacity-80 dark:bg-opacity-80">
          <div className="p-2 border-b border-border flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground ml-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="..."
              className="w-full bg-transparent p-2 outline-none text-sm font-medium"
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
            {filteredCategories.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground italic">
                {t("noTransactionsFound")}
              </div>
            )}

            {filteredCategories.map((cat) => {
              const Icon = cat.icon ? IconMap[cat.icon] : MoreHorizontal
              const isSelected = cat.id === value

              return (
                <div
                  key={cat.id}
                  className={cn(
                    "w-full flex items-center justify-between p-1 rounded-lg transition-all group",
                    isSelected ? "bg-primary text-white" : "hover:bg-secondary/50"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onChange(cat.id, cat.name)
                      setIsOpen(false)
                    }}
                    className="flex-1 flex items-center gap-3 p-1 rounded-md text-left transition-all"
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                      isSelected ? "bg-white/20 text-white" : "bg-secondary/30 text-primary group-hover:bg-white dark:group-hover:bg-charcoal"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-sm tracking-tight">{cat.name}</span>
                  </button>

                  {cat.user_id && (
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, cat.id)}
                      className={cn(
                        "p-1.5 mr-1 rounded-md hover:bg-coral/20 hover:text-coral transition-all opacity-0 group-hover:opacity-100",
                        isSelected && "text-white/70 hover:bg-white/20 hover:text-white"
                      )}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              onAddNew()
              setIsOpen(false)
            }}
            className="w-full p-3 bg-secondary/20 hover:bg-secondary/40 border-t border-border flex items-center justify-center gap-2 font-bold text-sm transition-all text-primary"
          >
            <Plus className="h-4 w-4" />
            {t("addCategory")}
          </button>
        </div>
      )}
    </div>
  )
}
