import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function checkColumns() {
  console.log("Checking columns for 'transactions' table...")

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .limit(1)

  if (error) {
    console.error("❌ Error selecting from transactions:", error)
    if (error.message.includes("schema cache")) {
      console.log("TIP: Try resetting the db connection or waiting a minute.")
    }
  } else {
    console.log("✅ Successfully selected from transactions.")
    if (data.length > 0) {
      console.log("Columns found in first row:", Object.keys(data[0]))
    } else {
      console.log("Table is empty, can't infer columns from select *.")
      // Try to get column info from information_schema
      const { data: cols, error: colError } = await supabase
        .rpc('get_table_columns', { table_name: 'transactions' })

      if (colError) {
        // Fallback: try raw query if we have a way... but we don't easily here without a special RPC
        console.log("Couldn't use RPC to get columns. Let's try to insert a dummy row with just user_id to see what it complains about.")
      }
    }
  }
}

checkColumns()
