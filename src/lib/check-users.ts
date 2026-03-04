import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  db: { schema: "next_auth" }
})

async function checkUsers() {
  const { data: users, error } = await supabase.from("users").select("email")
  if (error) {
    console.error("Error fetching users:", error)
  } else {
    console.log("Registered users:", users.map(u => u.email).join(", "))
  }
}

checkUsers()
