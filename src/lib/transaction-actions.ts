"use server"

import { auth } from "@/auth"
import { createAdminClient } from "./supabase"
import { revalidatePath } from "next/cache"

export type TransactionType = 'income' | 'expense'

export interface TransactionData {
  amount: number
  type: TransactionType
  category: string
  category_id?: string
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
    category_id: data.category_id,
    description: data.description,
    date: data.date || new Date().toISOString(),
  })

  if (error) {
    console.error("Error adding transaction:", error)
    return { success: false, error: error.message }
  }

  revalidatePath('/[locale]/dashboard', 'layout')
  return { success: true }
}

export interface TransactionFilters {
  search?: string
  type?: 'all' | 'income' | 'expense'
  category_id?: string
  startDate?: string
  endDate?: string
  limit?: number
}

export async function getTransactions(filters: TransactionFilters = {}) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const supabase = createAdminClient()
  const { search, type, category_id, startDate, endDate, limit = 50 } = filters

  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', session.user.id)
    .order('date', { ascending: false })
    .limit(limit)

  if (search) {
    query = query.ilike('description', `%${search}%`)
  }

  if (type && type !== 'all') {
    query = query.eq('type', type)
  }

  if (category_id) {
    query = query.eq('category_id', category_id)
  }

  if (startDate) {
    query = query.gte('date', `${startDate}T00:00:00Z`)
  }

  if (endDate) {
    query = query.lte('date', `${endDate}T23:59:59Z`)
  }

  const { data, error } = await query

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
      category_id: data.category_id,
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
