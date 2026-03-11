import { getTranslations } from "next-intl/server"
import { getUserPreferences } from "@/lib/settings-actions"
import { SettingsForm } from "@/components/dashboard/SettingsForm"

export default async function SettingsPage() {
  const t = await getTranslations("Settings")
  const { data: preferences } = await getUserPreferences()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tight">
          {t("title")}
        </h2>
        <p className="text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <SettingsForm initialData={preferences} />
    </div>
  )
}
