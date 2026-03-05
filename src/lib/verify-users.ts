import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!, {
  db: { schema: 'next_auth' }
})

async function checkUsers() {
  console.log("Checking next_auth.users table...")

  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, name')

  if (error) {
    console.error("❌ Error fetching users:", error)
  } else {
    console.log(`✅ Found ${users?.length} users in next_auth.users`)
    users?.forEach(u => console.log(` - ${u.id}: ${u.email} (${u.name})`))
  }

  console.log("\nChecking public.users table (as a fallback)...")
  const { data: publicUsers, error: publicError } = await createClient(supabaseUrl!, supabaseServiceRoleKey!)
    .from('users')
    .select('id, email, name')

  if (publicError) {
    console.log("❌ public.users table not found or inaccessible.")
  } else {
    console.log(`✅ Found ${publicUsers?.length} users in public.users`)
    publicUsers?.forEach(u => console.log(` - ${u.id}: ${u.email} (${u.name})`))
  }
}

checkUsers()
