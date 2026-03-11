import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function diagnose() {
  // Check what the budgets_user_id_fkey actually references
  const { data, error } = await supabase.rpc('exec_sql', {
    query: `
      SELECT
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_schema AS foreign_table_schema,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage ccu
        ON tc.constraint_name = ccu.constraint_name
      WHERE tc.table_name = 'budgets'
        AND tc.constraint_type = 'FOREIGN KEY';
    `
  })

  if (error) {
    // Fallback: try direct query to pg_constraint
    console.log("RPC not available, trying direct approach...")

    // Check if the budgets table has any rows we can query
    const { data: budgetRows, error: budgetError } = await supabase
      .from('budgets')
      .select('*')
      .limit(1)

    console.log("Budgets table query:", budgetError ? "ERROR: " + budgetError.message : "OK, rows: " + JSON.stringify(budgetRows))

    // Try to insert with a known user_id to see what actually fails
    return
  }

  console.log("FK constraints on budgets:", JSON.stringify(data, null, 2))
}

diagnose()
