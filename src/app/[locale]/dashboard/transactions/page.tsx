import { auth } from "@/auth"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"
import { getTransactions, TransactionFilters as FilterType } from "@/lib/transaction-actions"
import { AddTransactionForm } from "@/components/dashboard/AddTransactionForm"
import { TransactionFilters } from "@/components/dashboard/TransactionFilters"
import { TransactionList } from "@/components/dashboard/TransactionList"

export default async function TransactionsPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const t = await getTranslations("Transactions")
  const params = await searchParams

  const filters: FilterType = {
    search: typeof params.search === 'string' ? params.search : undefined,
    type: (params.type === 'income' || params.type === 'expense') ? params.type as 'income' | 'expense' : undefined,
    category_id: typeof params.category_id === 'string' ? params.category_id : undefined,
    startDate: typeof params.startDate === 'string' ? params.startDate : undefined,
    endDate: typeof params.endDate === 'string' ? params.endDate : undefined,
    limit: 50
  }

  const { data: transactions = [] } = await getTransactions(filters)

  const isFiltered = !!(filters.search || filters.type || filters.category_id || filters.startDate || filters.endDate)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black tracking-tight">
            {t("title")}
          </h2>
          <p className="text-muted-foreground">
            Manage your income and expenses manually.
          </p>
        </div>
        <AddTransactionForm />
      </div>

      <Suspense fallback={<div className="h-32 bg-secondary/10 rounded-3xl animate-pulse" />}>
        <TransactionFilters />
      </Suspense>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            {transactions.length > 0
              ? (isFiltered ? t("filteredResults") : t("transactionHistory"))
              : t("noTransactionsFound")}
          </h3>
          <div className="text-xs font-bold px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
            {transactions.length} {t("title").toLowerCase()}
          </div>
        </div>
        <TransactionList transactions={transactions} />
      </div>
    </div>
  )
}
