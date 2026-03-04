import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  db: { schema: 'next_auth' }
})

async function diagnostic() {
  console.log("Checking Supabase Connection (Schema: next_auth)...")

  // 1. Basic Table Access
  const requiredTables = ['users', 'accounts', 'sessions', 'verification_tokens']
  for (const table of requiredTables) {
    const { error } = await supabase.from(table).select('*').limit(0)
    if (error) {
      console.error(`❌ Error connecting to '${table}' table:`, error.message)
      if (error.message.includes("Invalid schema")) {
        console.error("   TIP: Check 'Exposed schemas' in Supabase API settings!")
      }
    } else {
      console.log(`✅ SUCCESS: Connected to '${table}' table.`)
    }
  }

  // 2. Mimic getUserByAccount (The failing query in the logs)
  console.log("\nTesting exactly what failed (getUserByAccount query)...")
  console.log("Query: supabase.from('accounts').select('users (*)')")

  const { data, error: joinError } = await supabase
    .from('accounts')
    .select('users (*)')
    .match({ provider: 'google', providerAccountId: 'test' })
    .maybeSingle()

  if (joinError) {
    console.error("❌ JOIN ERROR:", joinError.message)
    console.error("   Full Error Object:", JSON.stringify(joinError, null, 2))
  } else {
    console.log("✅ JOIN SUCCESS (Query worked, even if no result)")
  }

  // 3. Test userId column casing
  console.log("\nChecking column names in 'accounts'...")
  const { error: camelIdError } = await supabase.from('accounts').select('userId').limit(0)
  if (camelIdError) {
    console.log("❌ 'userId' (camelCase) column NOT found:", camelIdError.message)
  } else {
    console.log("✅ 'userId' (camelCase) column found.")
  }

  const { error: snakeIdError } = await supabase.from('accounts').select('user_id').limit(0)
  if (snakeIdError) {
    console.log("❌ 'user_id' (snake_case) column NOT found:", snakeIdError.message)
  } else {
    console.log("✅ 'user_id' (snake_case) column found.")
  }
}

diagnostic()
