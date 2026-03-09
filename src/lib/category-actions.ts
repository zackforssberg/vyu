"use server"

import { auth } from "@/auth"
import { createAdminClient } from "./supabase"
import { revalidatePath } from "next/cache"

export interface Category {
  id: string
  name: string
  icon?: string
  type: 'income' | 'expense' | 'both'
  user_id: string | null
}

export async function getCategories() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const supabase = createAdminClient()

  // Fetch categories where user_id is NULL (global) OR user_id matches current user
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .or(`user_id.is.null,user_id.eq.${session.user.id}`)
    .order('name', { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data: data as Category[] }
}

export async function addCategory(data: { name: string, icon?: string, type: 'income' | 'expense' | 'both' }) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const supabase = createAdminClient()

  const { data: newCategory, error } = await supabase
    .from('categories')
    .insert({
      name: data.name,
      icon: data.icon,
      type: data.type,
      user_id: session.user.id
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding category:", error)
    return { success: false, error: error.message }
  }

  revalidatePath('/[locale]/dashboard', 'layout')
  return { success: true, data: newCategory }
}

export async function deleteCategory(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
    .eq('user_id', session.user.id) // Only allow deleting if it belongs to the user

  if (error) {
    console.error("Error deleting category:", error)
    return { success: false, error: error.message }
  }

  revalidatePath('/[locale]/dashboard', 'layout')
  return { success: true }
}
