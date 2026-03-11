-- ==============================================
-- Run this ENTIRE script in Supabase SQL Editor
-- ==============================================

-- Step 1: Drop the broken FK that points to public.users
ALTER TABLE public.budgets
  DROP CONSTRAINT IF EXISTS budgets_user_id_fkey;

-- Step 2: Re-add FK pointing to next_auth.users (where NextAuth actually stores users)
ALTER TABLE public.budgets
  ADD CONSTRAINT budgets_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE;

-- Step 3: Add FK from category_id to categories (if not already present)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'budgets_category_id_fkey'
  ) THEN
    ALTER TABLE public.budgets
      ADD CONSTRAINT budgets_category_id_fkey
      FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;
  END IF;
END;
$$;

-- Step 4: Add unique partial index for category budgets
CREATE UNIQUE INDEX IF NOT EXISTS budgets_user_category_period_idx
  ON public.budgets (user_id, category_id, period)
  WHERE category_id IS NOT NULL;

-- Step 5: Add unique partial index for total budget (no category)
CREATE UNIQUE INDEX IF NOT EXISTS budgets_user_null_category_period_idx
  ON public.budgets (user_id, period)
  WHERE category_id IS NULL;
