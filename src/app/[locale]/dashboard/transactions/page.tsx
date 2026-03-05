import { auth } from "@/auth"
import { getTranslations } from "next-intl/server"
import { getTransactions } from "@/lib/transaction-actions"
import { AddTransactionForm } from "@/components/dashboard/AddTransactionForm"
import { TransactionList } from "@/components/dashboard/TransactionList"

export default async function TransactionsPage() {
  const t = await getTranslations("Transactions")
  const { data: transactions = [] } = await getTransactions(50)

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

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            {t("last30Days")}
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
