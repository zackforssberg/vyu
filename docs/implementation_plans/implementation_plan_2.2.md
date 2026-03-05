# Phase 2.2: Transactions Management Implementation Plan

Implement CRUD operations for manually adding, viewing, and deleting income and expenses.

## Proposed Changes

### [Component] Database (Supabase)
Define the schema for storing user transactions.

#### [NEW] [transactions.sql](file:///Users/zack/code/vyu/supabase/migrations/transactions.sql)
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to users)
- `amount`: Numeric (Required)
- `type`: Text ('income' | 'expense')
- `category`: Text (Required)
- `description`: Text
- `date`: Timestamp (Defaults to now)
- `created_at`: Timestamp

### [Component] Server Actions
Logic for interacting with the database.

#### [NEW] [transaction-actions.ts](file:///Users/zack/code/vyu/src/lib/transaction-actions.ts)
- `addTransaction(data)`
- `getTransactions(filters)`
- `deleteTransaction(id)`
- `updateTransaction(id, data)`

### [Component] Transactions UI
Localized components for transaction management.

#### [NEW] [transactions/page.tsx](file:///Users/zack/code/vyu/src/app/[locale]/dashboard/transactions/page.tsx)
Main list view for transactions.

#### [NEW] [AddTransactionForm.tsx](file:///Users/zack/code/vyu/src/components/dashboard/AddTransactionForm.tsx)
Modal or inline form to add a new transaction.

#### [NEW] [TransactionList.tsx](file:///Users/zack/code/vyu/src/components/dashboard/TransactionList.tsx)
Table view of recent transactions with delete actions.

## Verification Plan

### Automated Tests
- Verify that server actions correctly insert and retrieve data from Supabase.
- Ensure only authenticated users can access their own transactions (RLS).

### Manual Verification
- Add a new transaction (Income/Expense).
- Verify it appears in the list.
- Delete a transaction and ensure the list updates.
- Switch languages and verify all labels in the form/list are translated.
