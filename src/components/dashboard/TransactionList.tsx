"use client"

import { useTranslations, useFormatter } from "next-intl"
import { deleteTransaction } from "@/lib/transaction-actions"
import { getUserPreferences } from "@/lib/settings-actions"
import { formatCurrency } from "@/lib/currency"
import { Trash2, Edit2, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { AddTransactionForm } from "./AddTransactionForm"

interface TransactionListProps {
  transactions: any[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  const t = useTranslations("Transactions")
  const format = useFormatter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingTransaction, setEditingTransaction] = useState<any | null>(null)
  const [currency, setCurrency] = useState("SEK")

  useEffect(() => {
    getUserPreferences().then(res => {
      if (res.success) setCurrency(res.data.currency)
    })
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return
    setDeletingId(id)
    try {
      await deleteTransaction(id)
    } finally {
      setDeletingId(null)
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-card border border-border rounded-3xl p-12 text-center text-muted-foreground italic">
        {t("noTransactionsFound")}
      </div>
    )
  }

  return (
    <>
      {editingTransaction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-lg">
            <AddTransactionForm
              initialData={editingTransaction}
              onSuccess={() => setEditingTransaction(null)}
              onCancel={() => setEditingTransaction(null)}
            />
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/10">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("date")}</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("category")}</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("description")}</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">{t("amount")}</th>
                <th className="px-6 py-4 w-28"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((tx) => (
                <tr key={tx.id} className="group hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium whitespace-nowrap">
                      {format.dateTime(new Date(tx.date), { day: 'numeric', month: 'short' })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/40 text-xs font-bold">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground/70 truncate max-w-[200px] block">
                      {tx.description || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={cn(
                      "flex items-center justify-end gap-1 font-black",
                      tx.type === 'income' ? "text-primary" : "text-coral"
                    )}>
                      {tx.type === 'income' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                      <span>
                        {formatCurrency(tx.amount, currency)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 pr-6">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingTransaction(tx)}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        disabled={deletingId === tx.id}
                        onClick={() => handleDelete(tx.id)}
                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
