# Implementation Plan - Phase 3.1: Monthly Budget

Implement the core budgeting feature, allowing users to set a total monthly spending cap and track their progress against it.

## Proposed Changes

### Database [Supabase]
#### [NEW] `20240310000000_create_budgets.sql`
- Create `public.budgets` table:
    - `id` (UUID, PK)
    - `user_id` (UUID, FK to `next_auth.users`, Unique with `category_id` and `period`)
    - `category_id` (UUID, FK to `public.categories`, nullable) - For Phase 3.1, we'll focus on a "Total" budget (categoryId is NULL).
    - `limit_amount` (DECIMAL)
    - `period` (TEXT: 'monthly')
- Add RLS policies for Select, Insert, Update, and Delete based on `user_id`.

### Server Actions
#### [NEW] [budget-actions.ts](file:///Users/zack/code/vyu/src/lib/budget-actions.ts)
- `getBudgets()`: Fetch all budgets for the current user.
- `updateBudget(amount)`: Upsert a total monthly budget (where `category_id` is NULL).
- `getBudgetProgress()`: Calculate current month's total expenses vs. the budget limit.

### Components
#### [NEW] [BudgetTracker.tsx](file:///Users/zack/code/vyu/src/components/dashboard/BudgetTracker.tsx)
- A visual component for the dashboard showing:
    - Current spending (calculated from transactions).
    - Total budget limit.
    - A animated progress bar (Teal color).
    - Percentage of budget used.
- "Edit Budget" button to open a small modal or inline input.

#### [MODIFY] [DashboardPage](file:///Users/zack/code/vyu/src/app/[locale]/dashboard/page.tsx)
- Integrate the `BudgetTracker` component into the dashboard layout.

## Verification Plan

### Manual Verification
1. **Budget Creation**: Set a monthly budget of $1,000 and verify it's saved in the database.
2. **Progress Calculation**: Add a $100 expense and verify the `BudgetTracker` updates to show 10% usage.
3. **Limit Updates**: Change the budget to $2,000 and verify the progress bar percentage adjusts accordingly.
4. **Empty State**: Verify the component handles cases where no budget is set.
