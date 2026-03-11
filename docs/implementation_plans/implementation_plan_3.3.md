# Implementation Plan - Phase 3.3: Category Budgets & Management Page

Create a dedicated page for managing category-specific budgets, allowing users to plan their spending in detail.

## Proposed Changes

### Server Actions
#### [MODIFY] [budget-actions.ts](file:///Users/zack/code/vyu/src/lib/budget-actions.ts)
- `getCategoryBudgets()`: Fetch all budgets including category details and current spending for the period.
- `upsertBudget(amount, categoryId?)`: Unified action to create or update budgets.
- `deleteBudget(id)`: Remove a specific budget limit.

### Components
#### [NEW] [AddBudgetForm.tsx](file:///Users/zack/code/vyu/src/components/dashboard/AddBudgetForm.tsx)
- A form (possibly a modal or slide-over) to:
    - Select a category (excluding categories that already have a budget).
    - Set a limit amount.
    - Set the period (default 'monthly').

#### [NEW] [BudgetCard.tsx](file:///Users/zack/code/vyu/src/components/dashboard/BudgetCard.tsx)
- A card for each category budget showing:
    - Category name and icon.
    - Limit vs. Actual spending.
    - Progress bar (colored based on %: Teal < 80%, Orange < 100%, Coral > 100%).
    - "Remaining" or "Over" amount.
    - Edit/Delete actions.

### Pages
#### [NEW] [BudgetsPage](file:///Users/zack/code/vyu/src/app/[locale]/dashboard/budgets/page.tsx)
- A dedicated page with:
    - Header with "Add Budget" button.
    - Grid of `BudgetCard` components.
    - Empty state if no budgets are set.

## Verification Plan

### Manual Verification
1. **Create Budget**: Add a budget for "Food" and verify it appears in the list.
2. **Progress Tracking**: Add a transaction for "Food" and verify the "Food" budget card updates its progress.
3. **Validation**: Try to create two budgets for the same category and verify it handles collisions (upsert).
4. **Deletion**: Delete a budget and verify the card is removed.
5. **UI Aesthetics**: Ensure progress bar colors change correctly as spending approaches or exceeds the limit.
