import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!)

async function debugSchema() {
  console.log("Attempting targeted selects to verify column existence...")
  const cols = ['id', 'user_id', 'amount', 'type', 'category', 'description', 'date']

  for (const col of cols) {
    const { error: colErr } = await supabase.from('transactions').select(col).limit(0)
    if (colErr) {
      console.log(`❌ Column '${col}' error:`, colErr.message)
    } else {
      console.log(`✅ Column '${col}' exists.`)
    }
  }

  console.log("\nChecking if table exists in next_auth schema...")
  const { error: nextAuthErr } = await createClient(supabaseUrl!, supabaseServiceRoleKey!, {
    db: { schema: 'next_auth' }
  }).from('transactions').select('id').limit(0)

  if (nextAuthErr) {
    console.log("❌ Table 'transactions' NOT found in 'next_auth' schema.")
  } else {
    console.log("✅ Table 'transactions' FOUND in 'next_auth' schema!")
  }
}

debugSchema()
