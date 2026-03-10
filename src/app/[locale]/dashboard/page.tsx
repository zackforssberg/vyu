import { SummaryCards } from "@/components/dashboard/SummaryCards"
import { auth } from "@/auth"
import { getTranslations } from "next-intl/server"
import { getTransactions } from "@/lib/transaction-actions"
import { TransactionList } from "@/components/dashboard/TransactionList"
import { Link } from "@/i18n/routing"
import { ArrowRight } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  const t = await getTranslations("Dashboard")
  const txT = await getTranslations("Transactions")
  const { data: transactions = [] } = await getTransactions({ limit: 5 })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tight">
          {t("welcomeBack", { name: session?.user?.name?.split(" ")[0] || "User" })}
        </h2>
        <p className="text-muted-foreground">
          Here's what's happening with your money today.
        </p>
      </div>

      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="min-h-[400px] rounded-3xl bg-secondary/20 border border-border flex flex-col items-center justify-center p-8 text-center text-muted-foreground italic">
          Spending trends chart coming in Phase 4...
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              {t("recentTransactions")}
            </h3>
            <Link
              href="/dashboard/transactions"
              className="text-xs font-bold flex items-center gap-1 text-primary hover:underline transition-all"
            >
              {t("viewAll")} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="rounded-3xl overflow-hidden border border-border bg-card shadow-sm">
             <TransactionList transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  )
}
