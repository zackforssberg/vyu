# Phase 2.1: Dashboard Layout Implementation Plan

Implement the core dashboard layout, including a responsive sidebar and a main content area for spending overviews.

## Proposed Changes

### [Component] Dashboard Layout
Create a dedicated layout for the dashboard that includes the sidebar and main content area.

#### [NEW] [dashboard/layout.tsx](file:///Users/zack/code/vyu/src/app/[locale]/dashboard/layout.tsx)
The layout wrapper for all dashboard routes, handling the sidebar and main content positioning.

#### [NEW] [dashboard/page.tsx](file:///Users/zack/code/vyu/src/app/[locale]/dashboard/page.tsx)
The main dashboard overview page.

### [Component] Navigation
Implement a responsive sidebar that uses the global `UIStore`.

#### [NEW] [Sidebar.tsx](file:///Users/zack/code/vyu/src/components/dashboard/Sidebar.tsx)
The sidebar component with navigation links (Overview, Transactions, Budgets, etc.).
- Responsive: Collapses on mobile, can be toggled via Zustand.
- Integrated with `next-intl` for localized labels.

#### [NEW] [DashboardNav.tsx](file:///Users/zack/code/vyu/src/components/dashboard/DashboardNav.tsx)
Top navigation bar for the dashboard (breadcrumbs, user profile, theme toggle).

### [Component] Spending Overview (Initial)
A high-level overview of spending stats.

#### [NEW] [SummaryCards.tsx](file:///Users/zack/code/vyu/src/components/dashboard/SummaryCards.tsx)
Cards showing Total Balance, Monthly Income, and Monthly Expenses (using mock data initially).

## Verification Plan

### Automated Tests
- Verify that the layout correctly renders the sidebar and main content.
- Ensure that the sidebar toggles correctly via Zustand state.

### Manual Verification
- Test the sidebar on different screen sizes (Mobile/Desktop).
- Verify that navigation links point to the correct localized routes.
- Visual inspection of the dashboard layout to ensure it adheres to the design system (Charcoal, Teal, Coral).
