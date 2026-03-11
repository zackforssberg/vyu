# Implementation Plan - Phase 3.2: User Preferences & Settings

Implement a comprehensive settings system to allow users to customize their experience, including currency, language, and theme preferences.

## Proposed Changes

### Database [Supabase]
#### [NEW] `20240310000001_create_user_preferences.sql`
- Create `public.user_preferences` table:
    - `id` (UUID, PK)
    - `user_id` (UUID, FK to `next_auth.users`, Unique)
    - `currency` (TEXT, default 'SEK') - e.g., 'USD', 'SEK', 'EUR'
    - `language` (TEXT, default 'en') - e.g., 'en', 'sv'
    - `theme` (TEXT, default 'system') - e.g., 'light', 'dark', 'system'
- Add RLS policies for Select, Insert, and Update based on `user_id`.

### Server Actions
#### [NEW] [settings-actions.ts](file:///Users/zack/code/vyu/src/lib/settings-actions.ts)
- `getUserPreferences()`: Fetch preferences for the current user.
- `updateUserPreferences(data)`: Upsert user preferences.

### Utilities
#### [NEW] [currency.ts](file:///Users/zack/code/vyu/src/lib/currency.ts)
- `formatCurrency(amount, currency)`: Helper function to format amounts based on user preference using `Intl.NumberFormat`.

### Components
#### [NEW] [SettingsForm.tsx](file:///Users/zack/code/vyu/src/components/dashboard/SettingsForm.tsx)
- A form to manage user preferences:
    - **Currency Select**: Searchable or simple dropdown with common currencies.
    - **Language Toggle**: Switch between English and Swedish.
    - **Theme Selector**: Toggle between Light, Dark, and System modes.

### Pages
#### [NEW] [SettingsPage](file:///Users/zack/code/vyu/src/app/[locale]/dashboard/settings/page.tsx)
- A dedicated settings page consistent with the dashboard layout.
- Uses `SettingsForm`.

### Refactoring
- Update `BudgetTracker.tsx`, `SummaryCards.tsx`, and `TransactionList.tsx` to use the `formatCurrency` utility and user preference.

## Verification Plan

### Manual Verification
1. **Preference Persistence**: Change currency to "USD" and language to "sv", refresh, and verify they persist.
2. **Global Application**: Verify all currency displays (Dashboard, Transactions, Budget) update correctly when the preference changes.
3. **Language Switch**: Verify that changing language in settings updates the UI immediately or after navigation.
4. **Theme Toggle**: Verify dark/light mode switching works correctly.
