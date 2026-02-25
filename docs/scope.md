# Project Scope: Personal Finance SaaS

This document defines the scope and development phases for the Personal Finance SaaS application, providing strict technical instructions for the implementation.

## 1. Project Overview
A modern, responsive web application for tracking personal finances, managing budgets, and gaining financial insights. The application uses a "freemium" model with Stripe integration for premium features.

## 2. Targeted Users
- **Free Users**: Individuals looking for a simple, manual way to track daily expenses and income.
- **Premium Users**: Power users requiring bank automation (Plaid), advanced forecasting, detailed historical analytics, and receipt management.

## 3. Development Phases Plan

### Phase 1: Foundation & Authentication
Establish the core infrastructure and secure access.
- [ ] **Infrastructure**: Next.js (App Router) project initialization with TailwindCSS and TypeScript.
- [ ] **Database**: Supabase PostgreSQL setup with the Supabase Client.
- [ ] **Authentication**: Auth.js implementation with Google and Email providers.
- [ ] **State Management**: Zustand for global UI state.

### Phase 2: MVP - Core Transaction Management
Implement the primary tracker features for basic users.
- [ ] **Dashboard**: Layout with responsive sidebar and main spending overview.
- [ ] **Transactions**: CRUD operations for manually adding income and expenses.
- [ ] **Categories**: System for default categories and category selection.
- [ ] **Search/Filter**: Filtering transactions by date, type, and keyword.

### Phase 3: Budgeting & Monitoring
Add tools for users to plan their spending.
- [ ] **Monthly Budget**: Interface to set a total monthly spending cap.
- [ ] **Budget Progress**: Visual progress bars showing "Budget vs. Actual".
- [ ] **Savings Goals (Premium)**: Creation and tracking of specific savings targets.
- [ ] **Alerts (Premium)**: UI notifications for budget thresholds at 80% and 100%.

### Phase 4: Analytics & Visualizations
Transform raw data into meaningful insights using Recharts.
- [ ] **Charts**: Pie charts for category spending and Bar charts for income vs. expense.
- [ ] **Historical Trends (Premium)**: Multi-month comparison charts.
- [ ] **Net Worth Tracker (Premium)**: Aggregated balance view across multiple manual accounts.
- [ ] **Forecasting (Premium)**: Statistical spending prediction logic based on historical averages.

### Phase 5: Monetization & External Integrations
Unlock the business model and automated features.
- [ ] **Stripe Integration**: Checkout flow for Premium upgrades and Customer Portal for subscription management.
- [ ] **Bank Sync (Premium)**: Tink API integration for automatic transaction fetching.
- [ ] **Data Portability (Premium)**: CSV and PDF export functionality for financial reports.
- [ ] **Receipt Uploads (Premium)**: Image upload support for transaction evidence.

### Phase 6: Launch Readiness & Polish
Final technical and UX refinements.
- [ ] **SEO**: Meta tags, OpenGraph images, and sitemap generation.
- [ ] **Performance**: Image optimization, code splitting, and database indexing.
- [ ] **Bug Squashing**: Comprehensive manual testing across devices.
- [ ] **Landing Page**: Conversion-focused home page highlighting features and pricing.

## 4. Technical Constraints & Out of Scope
- **Mobile Apps**: This scope is limited to a Progressive Web App (PWA); native iOS/Android apps are not included.
- **Manual Reconciliation**: Users must manually match bank transfers if not using Plaid sync.
- **Tax Filing**: The app provides reports but does not file taxes directly.

---

## Clarifications
1. **Tink Coverage**: Tink integration will prioritize all major Swedish banks (BankID supported).
2. **AI Forecasting**: Forecasting will use statistical linear regression based on the last 3 months of user data.
3. **Data Residency**: All data will be stored in Supabase's default region (AWS) unless a specific local requirement is provided.
