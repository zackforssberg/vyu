-- 0. Clean start
DROP TABLE IF EXISTS public.categories CASCADE;

-- 1. Create Categories Table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT, -- Lucide icon name
  "type" TEXT NOT NULL CHECK ("type" IN ('income', 'expense', 'both')),
  user_id UUID REFERENCES next_auth.users(id) ON DELETE CASCADE, -- NULL for global/default categories
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Anyone can view global categories"
  ON public.categories FOR SELECT
  USING (user_id IS NULL);

CREATE POLICY "Users can view their own categories"
  ON public.categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
  ON public.categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
  ON public.categories FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Seed Default Global Categories
INSERT INTO public.categories (name, icon, "type") VALUES
-- Expenses
('Food & Drinks', 'Utensils', 'expense'),
('Transport', 'Car', 'expense'),
('Housing', 'Home', 'expense'),
('Entertainment', 'Play', 'expense'),
('Shopping', 'ShoppingBag', 'expense'),
('Health', 'Heart', 'expense'),
('Utilities', 'Zap', 'expense'),
('Travel', 'Plane', 'expense'),
('Education', 'Book', 'expense'),
-- Income
('Salary', 'Wallet', 'income'),
('Freelance', 'Laptop', 'income'),
('Gift', 'Gift', 'income'),
('Investment', 'TrendingUp', 'income'),
-- Other
('Other', 'MoreHorizontal', 'both');

-- 5. Update Transactions Table
-- First, add the category_id column
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id);

-- Migration hint: You might want to map existing text categories to these IDs later,
-- but for now new transactions will use this.
