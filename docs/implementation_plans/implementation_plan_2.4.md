# Implementation Plan - Phase 2.4: Search & Filtering

Implement a robust search and filtering system for transactions, allowing users to find specific records by date, type, category, and keywords.

## Proposed Changes

### Server Actions
#### [MODIFY] [transaction-actions.ts](file:///Users/zack/code/vyu/src/lib/transaction-actions.ts)
- Update `getTransactions` to accept a `filters` object:
    ```typescript
    export interface TransactionFilters {
      search?: string
      type?: 'all' | 'income' | 'expense'
      categoryId?: string
      startDate?: string
      endDate?: string
      limit?: number
    }
    ```
- Use Supabase's `.ilike()` for keyword search (description or category name).
- Use `.eq()` for type and category filtering.
- Use `.gte()` and `.lte()` for date ranges.

### Components
#### [NEW] [TransactionFilters.tsx](file:///Users/zack/code/vyu/src/components/dashboard/TransactionFilters.tsx)
- A client component that manages the filtering UI.
- **Search Input**: Real-time filtering (debounced) or on-demand search.
- **Type Toggle/Select**: Switch between All, Income, and Expense.
- **Date Range**: Two date inputs for start and end dates.
- **Category Select**: Dropdown to filter by specific categories.
- Uses `useRouter` and `usePathname` from `next/navigation` to update URL search parameters.

### Pages
#### [MODIFY] [TransactionsPage](file:///Users/zack/code/vyu/src/app/[locale]/dashboard/transactions/page.tsx)
- Access `searchParams` from the page props.
- Pass `searchParams` properties to `getTransactions`.
- Include the `TransactionFilters` component above the `TransactionList`.

## Verification Plan

### Manual Verification
1. **Keyword Search**: Enter a word from a transaction description and verify only matching rows appear.
2. **Type Filter**: Switch to "Income" and verify no "Expense" transactions are visible.
3. **Date Filter**: Set a date range and verify only transactions within that window are shown.
4. **Combined Filters**: Search for "Groceries" with type "Expense" and a specific date range, ensuring all conditions are honored.
5. **URL Sync**: Refresh the page with filters active and verify they are correctly applied on reload.
