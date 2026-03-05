import { ThemeLanguageToggle } from "@/components/ThemeLanguageToggle"
import { auth } from "@/auth"
import { useTranslations } from "next-intl"

export async function DashboardNav() {
  const session = await auth()

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8">
      <div className="flex items-center gap-4">
        {/* Breadcrumbs or Page Title could go here */}
      </div>

      <div className="flex items-center gap-4">
        {session?.user && (
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold leading-none">{session.user.name}</span>
              <span className="text-xs text-muted-foreground">{session.user.email}</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border">
              {session.user.image ? (
                <img src={session.user.image} alt={session.user.name || "User"} className="h-full w-full object-cover" />
              ) : (
                <span className="font-bold text-primary">{session.user.name?.charAt(0)}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
