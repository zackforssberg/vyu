"use client"

import { useUIStore } from "@/lib/store"
import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/routing"
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Wallet,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SignOut } from "@/components/AuthButtons"

export function Sidebar() {
  const t = useTranslations("Dashboard")
  const { isSidebarOpen, toggleSidebar } = useUIStore()
  const pathname = usePathname()

  const navItems = [
    { name: t("overview"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("transactions"), href: "/dashboard/transactions", icon: Receipt },
    { name: t("budgets"), href: "/dashboard/budgets", icon: PieChart },
    { name: t("categories"), href: "/dashboard/categories", icon: Wallet },
  ]

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen z-50 bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col shadow-xl",
        isSidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div className="h-16 flex items-center px-6 border-b border-border mb-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-110">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          {isSidebarOpen && (
            <span className="font-black text-2xl tracking-tighter text-foreground">Vyu</span>
          )}
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 group relative",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "" : "group-hover:scale-110 duration-200 transition-transform")} />
              {isSidebarOpen && (
                <span className="font-semibold">{item.name}</span>
              )}
              {!isSidebarOpen && (
                 <div className="absolute left-16 bg-card border border-border px-2 py-1 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
                    {item.name}
                 </div>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-border mt-auto space-y-1">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 text-muted-foreground hover:bg-secondary/50 hover:text-foreground group relative",
            pathname === "/dashboard/settings" && "bg-secondary text-foreground"
          )}
        >
          <Settings className="h-5 w-5 shrink-0 group-hover:rotate-45 duration-300 transition-transform" />
          {isSidebarOpen && (
            <span className="font-semibold">{t("settings")}</span>
          )}
          {!isSidebarOpen && (
             <div className="absolute left-16 bg-card border border-border px-2 py-1 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
                {t("settings")}
             </div>
          )}
        </Link>

        <SignOut className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all group relative">
          <LogOut className="h-5 w-5 shrink-0" />
          {isSidebarOpen && (
            <span className="font-semibold">{t("logout")}</span>
          )}
          {!isSidebarOpen && (
             <div className="absolute left-16 bg-card border border-border px-2 py-1 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
                {t("logout")}
             </div>
          )}
        </SignOut>

        <button
          onClick={toggleSidebar}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all group relative"
        >
          {isSidebarOpen ? <ChevronLeft className="h-5 w-5 shrink-0" /> : <ChevronRight className="h-5 w-5 shrink-0" />}
          {isSidebarOpen && (
            <span className="font-semibold italic text-xs uppercase tracking-widest">{t("collapse")}</span>
          )}
          {!isSidebarOpen && (
             <div className="absolute left-16 bg-card border border-border px-2 py-1 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
                {isSidebarOpen ? t("collapse") : "Expand"}
             </div>
          )}
        </button>
      </div>
    </aside>
  )
}
