"use client"

import { useTranslations } from "next-intl"
import { TrendingUp, TrendingDown, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

export function SummaryCards() {
  const t = useTranslations("Dashboard")

  // Mock data for now
  const stats = [
    {
      label: t("totalBalance"),
      value: "45,230 SEK",
      change: "+12.5%",
      trend: "up",
      icon: CreditCard,
      color: "bg-primary/10 text-primary"
    },
    {
      label: t("monthlyIncome"),
      value: "32,000 SEK",
      change: "+2.3%",
      trend: "up",
      icon: TrendingUp,
      color: "bg-green-500/10 text-green-600"
    },
    {
      label: t("monthlyExpenses"),
      value: "14,500 SEK",
      change: "-5.2%",
      trend: "down",
      icon: TrendingDown,
      color: "bg-coral/10 text-coral" // Using brand Coral
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", stat.color)}>
              <stat.icon className="h-6 w-6" />
            </div>
            <span className={cn(
              "text-xs font-bold px-2 py-1 rounded-full",
              stat.trend === "up" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
            )}>
              {stat.change}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
            <span className="text-2xl font-black tracking-tight">{stat.value}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
