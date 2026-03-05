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

async function checkConstraints() {
  console.log("Inspecting foreign key constraints for 'transactions'...")

  // Since we can't run raw SQL easily without an RPC,
  // we'll try to trigger an error by inserting a random UUID
  // and see exactly which table the error message mentions.

  const randomId = '00000000-0000-0000-0000-000000000000'
  console.log(`Attempting to insert transaction with dummy user_id: ${randomId}`)

  const { error } = await supabase.from('transactions').insert({
    user_id: randomId,
    amount: 100,
    type: 'expense',
    category: 'Test',
    description: 'Testing constraints'
  })

  if (error) {
    console.log("❌ Error response:")
    console.log(JSON.stringify(error, null, 2))

    // Look for the "details" or "message" to see the table reference
    if (error.message.includes("violates foreign key constraint")) {
      console.log("\nDETAILED ANALYSIS:")
      if (error.message.includes('table "users"')) {
         console.log("ALERT: The error mentions table \"users\" without a schema prefix.")
         console.log("This usually means it's referencing public.users, not next_auth.users!")
      }
    }
  } else {
    console.log("✅ Wait, the insert succeeded? That shouldn't happen with a random UUID if an FK exists.")
  }
}

checkConstraints()
