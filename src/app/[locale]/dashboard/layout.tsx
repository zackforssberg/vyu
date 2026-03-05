import { Sidebar } from "@/components/dashboard/Sidebar"
import { DashboardNav } from "@/components/dashboard/DashboardNav"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { UIProvider } from "@/components/dashboard/UIProvider"

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: any
}) {
  const { locale } = await params
  const session = await auth()

  if (!session) {
    redirect(`/${locale}`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex overflow-hidden">
      <Sidebar />
      <UIProvider>
        <DashboardNav />
        <main className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {children}
          </div>
        </main>
      </UIProvider>
    </div>
  )
}
