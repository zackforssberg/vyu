"use server"

import { auth } from "@/auth"
import { createAdminClient } from "./supabase"
import { revalidatePath } from "next/cache"

export interface UserPreferences {
  currency: string
  language: string
  theme: string
}

const DEFAULT_PREFERENCES: UserPreferences = {
  currency: 'SEK',
  language: 'en',
  theme: 'system'
}

export async function getUserPreferences(): Promise<{ success: boolean; data: UserPreferences }> {
  const session = await auth()
  if (!session?.user?.id) return { success: true, data: DEFAULT_PREFERENCES }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('user_preferences')
    .select('currency, language, theme')
    .eq('user_id', session.user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return { success: true, data: DEFAULT_PREFERENCES }
    }
    console.error("Error fetching user preferences:", error.message, error.code)
    return { success: false, data: DEFAULT_PREFERENCES }
  }

  return { success: true, data }
}

export async function updateUserPreferences(data: Partial<UserPreferences>): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: "Unauthorized" }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: session.user.id,
      ...data
    }, {
      onConflict: 'user_id'
    })

  if (error) {
    console.error("Error updating user preferences:", error)
    return { success: false, error: error.message }
  }

  revalidatePath('/[locale]/dashboard', 'layout')
  return { success: true }
}
