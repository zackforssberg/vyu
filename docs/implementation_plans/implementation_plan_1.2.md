# Database Setup (Supabase)

Integrate Supabase as the primary database for the application, including client setup and initial schema definition.

## Proposed Changes

### [Component] Supabase Integration
Files and configuration for connecting to Supabase.

#### [NEW] [.env.local.example](file:///Users/zack/code/vyu/.env.local.example)
Template for required environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).

#### [NEW] [supabase.ts](file:///Users/zack/code/vyu/src/lib/supabase.ts)
Utility file to export Supabase clients for both client-side and server-side usage.

#### [NEW] [schema.sql](file:///Users/zack/code/vyu/docs/schema.sql)
Initial SQL script to be executed in the Supabase SQL Editor to create `transactions`, `budgets`, `subscriptions`, and `categories` tables.

## Verification Plan

### Automated Tests
- Check if `src/lib/supabase.ts` correctly exports the clients.
- Verify that `npm run build` passes with the new dependencies.

### Manual Verification
- User needs to provide Supabase project credentials in `.env.local`.
- User will run the provided `schema.sql` in their Supabase project.
