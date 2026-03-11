import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!)

async function testTables() {
  const tables = ['user_preferences', 'budgets']
  for (const table of tables) {
    const { error } = await supabase.from(table).select('*').limit(0)
    if (error) {
      console.log(`❌ Table '${table}' error:`, error.message, error.code)
    } else {
      console.log(`✅ Table '${table}' exists.`)
    }
  }
}

testTables()
