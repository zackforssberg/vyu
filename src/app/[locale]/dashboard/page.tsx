import { SummaryCards } from "@/components/dashboard/SummaryCards"
import { auth } from "@/auth"
import { getTranslations } from "next-intl/server"

export default async function DashboardPage() {
  const session = await auth()
  const t = await getTranslations("Dashboard")

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

      {/* Placeholder for Charts / Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-[400px] rounded-3xl bg-secondary/20 border border-border flex items-center justify-center p-8 text-center text-muted-foreground italic">
          Spending trends chart coming in Phase 4...
        </div>
        <div className="h-[400px] rounded-3xl bg-secondary/20 border border-border flex items-center justify-center p-8 text-center text-muted-foreground italic">
          Recent transactions coming in Phase 2.2...
        </div>
      </div>
    </div>
  )
}
