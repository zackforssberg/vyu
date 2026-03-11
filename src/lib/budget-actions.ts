"use server"

import { auth } from "@/auth"
import { createAdminClient } from "./supabase"
import { revalidatePath } from "next/cache"

export interface Budget {
  id: string
  user_id: string
  category_id?: string | null
  limit_amount: number
  period: string
}

export interface CategoryBudget extends Budget {
  category_name: string | null
  spent: number
}

export async function getBudgets(): Promise<{ success: boolean; data?: Budget[]; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: "Unauthorized" }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', session.user.id)

  if (error) {
    console.error("Error fetching budgets:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function getCategoryBudgets(): Promise<{ success: boolean; data?: CategoryBudget[]; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: "Unauthorized" }

  const supabase = createAdminClient()

  // Fetch budgets WITHOUT the FK join (categories relationship may not be set up in DB)
  const { data: budgets, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', session.user.id)

  if (error) {
    console.error("Error fetching budgets:", error)
    return { success: false, error: error.message }
  }

  // Fetch categories separately for lookup
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')

  const categoryMap = new Map((categories || []).map(c => [c.id, c.name]))

  // Calculate current month's spent for each budget
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

  const result: CategoryBudget[] = []

  for (const budget of budgets) {
    let query = supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', session.user.id)
      .eq('type', 'expense')
      .gte('date', startOfMonth)
      .lte('date', endOfMonth)

    if (budget.category_id) {
      query = query.eq('category_id', budget.category_id)
    }
    // For total budget (no category), sum ALL expenses
    // (don't filter by category_id so we get the full month total)

    const { data: transactions } = await query
    const spent = transactions?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0

    result.push({
      ...budget,
      category_name: budget.category_id ? (categoryMap.get(budget.category_id) || null) : null,
      spent
    })
  }

  return { success: true, data: result }
}

export async function upsertBudget(amount: number, categoryId: string | null = null): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: "Unauthorized" }

  const supabase = createAdminClient()

  // Check if a budget already exists for this user/category/period
  let existingQuery = supabase
    .from('budgets')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('period', 'monthly')

  if (categoryId) {
    existingQuery = existingQuery.eq('category_id', categoryId)
  } else {
    existingQuery = existingQuery.is('category_id', null)
  }

  const { data: existing } = await existingQuery.maybeSingle()

  let error

  if (existing?.id) {
    // UPDATE existing
    const { error: updateError } = await supabase
      .from('budgets')
      .update({ limit_amount: amount })
      .eq('id', existing.id)
    error = updateError
  } else {
    // INSERT new
    const { error: insertError } = await supabase
      .from('budgets')
      .insert({
        user_id: session.user.id,
        category_id: categoryId,
        limit_amount: amount,
        period: 'monthly'
      })
    error = insertError
  }

  if (error) {
    console.error("Error upserting budget:", error)
    return { success: false, error: error.message }
  }

  revalidatePath('/[locale]/dashboard', 'layout')
  revalidatePath('/[locale]/dashboard/budgets', 'page')
  return { success: true }
}

export async function deleteBudget(budgetId: string): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: "Unauthorized" }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', budgetId)
    .eq('user_id', session.user.id)

  if (error) {
    console.error("Error deleting budget:", error)
    return { success: false, error: error.message }
  }

  revalidatePath('/[locale]/dashboard', 'layout')
  revalidatePath('/[locale]/dashboard/budgets', 'page')
  return { success: true }
}

export async function updateBudget(amount: number): Promise<{ success: boolean; error?: string }> {
  return upsertBudget(amount, null)
}

export async function getBudgetProgress(): Promise<{
  success: boolean;
  spent: number;
  limit: number;
  error?: string
}> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, spent: 0, limit: 0, error: "Unauthorized" }

  const supabase = createAdminClient()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

  const { data: transactions, error: txError } = await supabase
    .from('transactions')
    .select('amount')
    .eq('user_id', session.user.id)
    .eq('type', 'expense')
    .gte('date', startOfMonth)
    .lte('date', endOfMonth)

  if (txError) {
    console.error("Error fetching transactions for budget:", txError)
    return { success: false, spent: 0, limit: 0, error: txError.message }
  }

  const totalSpent = transactions?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0

  // Find total budget (no category_id)
  const { data: budget, error: bError } = await supabase
    .from('budgets')
    .select('limit_amount')
    .eq('user_id', session.user.id)
    .is('category_id', null)
    .maybeSingle()

  if (bError) {
    console.error("Error fetching budget limit:", bError)
    return { success: false, spent: totalSpent, limit: 0, error: bError.message }
  }

  return {
    success: true,
    spent: totalSpent,
    limit: budget?.limit_amount || 0
  }
}
