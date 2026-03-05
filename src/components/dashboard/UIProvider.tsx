"use client"

import { useUIStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function UIProvider({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useUIStore()

  return (
    <div className={cn(
      "flex-1 flex flex-col min-w-0 h-screen transition-all duration-300 ease-in-out",
      isSidebarOpen ? "pl-64" : "pl-20"
    )}>
      {children}
    </div>
  )
}
