# Implementation Plan - Phase 2.3: Categories System

Implement a structured categories system with support for global defaults and user-specific custom categories.

## Proposed Changes

### Database [Supabase]
#### [NEW] `20240309000000_create_categories.sql`
- Create `public.categories` table:
    - `id` (UUID, PK)
    - `name` (TEXT)
    - `icon` (TEXT) - Lucide icon name
    - `type` (TEXT: 'income', 'expense', 'both')
    - `user_id` (UUID, FK to `next_auth.users`, nullable)
- Seed default categories:
    - Expense: Food & Drinks, Transport, Housing, Entertainment, Shopping, Health, Utilities.
    - Income: Salary, Freelance, Gift, Investment.
- Update `public.transactions`:
    - Add `category_id` (UUID, FK to `public.categories`).

### Server Actions
#### [MODIFY] [category-actions.ts](file:///Users/zack/code/vyu/src/lib/category-actions.ts)
- `getCategories()`: Fetch categories where `user_id` is NULL OR matches current session.
- `addCategory(data)`: Create a custom category for the user.
- [NEW] `deleteCategory(id)`: Remove a user's custom category (only if `user_id` matches).

### Components
#### [NEW] [CategoryDropdown.tsx](file:///Users/zack/code/vyu/src/components/dashboard/CategoryDropdown.tsx)
- Custom-styled dropdown matching the app's foggy/glassmorphism theme.
- Shows category icons (mapped from Lucide).
- Allows selecting existing categories.
- Includes "Add New" button within the dropdown.
- Shows a delete icon next to custom (user) categories.

#### [MODIFY] [AddTransactionForm.tsx](file:///Users/zack/code/vyu/src/components/dashboard/AddTransactionForm.tsx)
- Replace native `<select>` with `CategoryDropdown`.
- Remove the inline "New Category" input field (it will be handled by the dropdown or a specialized modal/state within it).

#### [MODIFY] [TransactionList.tsx](file:///Users/zack/code/vyu/src/components/dashboard/TransactionList.tsx)
- (Optional) Update to show category icons if available.

## Verification Plan

### Automated Tests
- N/A (Manual verification in Supabase and Browser)

### Manual Verification
1. **DB Setup**: Run migration and verify rows in Supabase SQL editor.
2. **Category Fetching**: Log categories in `AddTransactionForm` to ensure both global and user categories load.
3. **Transaction Creation**: Add a transaction and verify the `category_id` is correctly populated in the DB.
4. **Type Filtering**: Verify that switching between 'Income' and 'Expense' updates the category list correctly.
