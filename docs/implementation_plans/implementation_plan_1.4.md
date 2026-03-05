# Phase 1.4: Design System Implementation Plan

Establish the design system foundation (brand colors, typography, dark mode, and layout rules).

## Proposed Changes

### [Component] Brand Identity & Theme
Configure Tailwind with brand colors and setup dark mode support.

#### [MODIFY] [tailwind.config.ts](file:///Users/zack/code/vyu/tailwind.config.ts)
Add brand colors:
- **Primary**: Teal (`#1B9AAA`)
- **Secondary**: Coral (`#FF8360`)
- **Dark Elements**: Charcoal (`#333333`)

#### [MODIFY] [globals.css](file:///Users/zack/code/vyu/src/app/globals.css)
Update CSS variables for light and dark modes according to the brand scheme.

#### [NEW] [Providers.tsx](file:///Users/zack/code/vyu/src/components/Providers.tsx)
Context providers for `next-themes` (Dark Mode) to handle theme switching.

#### [NEW] [ThemeLanguageToggle.tsx](file:///Users/zack/code/vyu/src/components/ThemeLanguageToggle.tsx)
A unified toggle for switching between Light/Dark modes and English/Swedish languages.

## Verification Plan

### Automated Tests
- Check that brand colors are correctly applied in a test component.
- Verify Tailwind utility classes for colors (e.g., `bg-primary`, `text-secondary`) work as expected.

### Manual Verification
- Test Dark Mode toggle and verify it persists across page reloads.
- Visual inspection of the UI to ensure the brand colors match the design direction (Teal, Coral, Charcoal).
