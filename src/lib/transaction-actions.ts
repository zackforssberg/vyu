"use server"

import { auth } from "@/auth"
import { createAdminClient } from "./supabase"
import { revalidatePath } from "next/cache"

export type TransactionType = 'income' | 'expense'

export interface TransactionData {
  amount: number
  type: TransactionType
  category: string
  description?: string
  date?: string
}

export async function addTransaction(data: TransactionData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const supabase = createAdminClient()

  const { error } = await supabase.from('transactions').insert({
    user_id: session.user.id,
    amount: data.amount,
    type: data.type,
    category: data.category,
    description: data.description,
    date: data.date || new Date().toISOString(), // Use provided date or now
  })

  if (error) {
    console.error("Error adding transaction:", error)
    return { success: false, error: error.message }
  }

  revalidatePath('/[locale]/dashboard', 'layout')
  return { success: true }
}

export async function getTransactions(limit = 10) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', session.user.id)
    .order('date', { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching transactions:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function deleteTransaction(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', session.user.id)

  if (error) {
    console.error("Error deleting transaction:", error)
    return { success: false, error: error.message }
  }

  revalidatePath('/[locale]/dashboard', 'layout')
  return { success: true }
}

export async function updateTransaction(id: string, data: TransactionData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('transactions')
    .update({
      amount: data.amount,
      type: data.type,
      category: data.category,
      description: data.description,
      date: data.date || new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', session.user.id)

  if (error) {
    console.error("Error updating transaction:", error)
    return { success: false, error: error.message }
  }

  revalidatePath('/[locale]/dashboard', 'layout')
  return { success: true }
}
