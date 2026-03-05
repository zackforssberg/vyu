# Phase 1.5: Authentication Implementation Plan

Establish a secure and flexible authentication system using Auth.js (NextAuth v5) supporting multiple providers and localized flows.

## Proposed Changes

### [Component] Authentication Core
Setup Auth.js with Supabase adapter and session management.

#### [NEW] [auth.ts](file:///Users/zack/code/vyu/src/auth.ts)
Core Auth.js configuration.
- **Providers**: Google, Resend (Magic Link), and Credentials (Email/Password).
- **Session Strategy**: JWT.
- **Adapter**: Supabase Adapter for user data persistence.

#### [NEW] [auth-actions.ts](file:///Users/zack/code/vyu/src/lib/auth-actions.ts)
Server actions for auth-related operations:
- `signUp`: User registration with password hashing (bcryptjs).
- `signInAction` / `signOutAction`: Wrappers for Auth.js methods.
- `requestPasswordReset` / `resetPassword`: Full reset-password flow.

### [Component] Authentication UI
Localized forms and buttons for the auth flow.

#### [NEW] [SignInForm.tsx](file:///Users/zack/code/vyu/src/components/SignInForm.tsx)
Unified form supporting both Magic Link and Password login modes.

#### [NEW] [SignUpForm.tsx](file:///Users/zack/code/vyu/src/components/SignUpForm.tsx)
Registration form for new users.

#### [NEW] [ForgotPasswordForm.tsx](file:///Users/zack/code/vyu/src/components/ForgotPasswordForm.tsx)
Form to request password reset links.

#### [NEW] [AuthButtons.tsx](file:///Users/zack/code/vyu/src/components/AuthButtons.tsx)
Reusable components for Sign In (Google) and Sign Out actions.

## Verification Plan

### Automated Tests
- Verify that protected routes (via middleware) redirect correctly based on auth state.
- Check that password hashing works correctly during signup.
- Verify token generation and validation for the reset flow.

### Manual Verification
- Test Google OAuth login.
- Test Magic Link delivery and login.
- Test Email/Password registration and login.
- Test Forgot Password flow from link request to new password setting.
- Verify all auth UI elements are correctly localized in EN and SV.
