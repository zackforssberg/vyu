# Phase 1.3: i18n & Design System Implementation Plan

Implement multi-language support (EN/SV) and establish the design system foundation (brand colors, dark mode).

## Proposed Changes

### [Component] i18n & Routing
Setup `next-intl` with localized routing.

#### [NEW] [en.json](file:///Users/zack/code/vyu/messages/en.json) & [sv.json](file:///Users/zack/code/vyu/messages/sv.json)
Initial dictionaries for English and Swedish.

#### [NEW] [routing.ts](file:///Users/zack/code/vyu/src/i18n/routing.ts) & [request.ts](file:///Users/zack/code/vyu/src/i18n/request.ts)
Configuration for locales and message loading.

#### [MOVE] [src/app/](file:///Users/zack/code/vyu/src/app/) -> [src/app/[locale]/](file:///Users/zack/code/vyu/src/app/[locale]/)
Localized routing structure.

### [Component] Design System
Configure brand identity and theme support.

#### [MODIFY] [tailwind.config.ts](file:///Users/zack/code/vyu/tailwind.config.ts) (or globals.css)
Add brand colors: Teal (`#1B9AAA`), Coral (`#FF8360`), and Charcoal (`#333333`).

#### [NEW] [Providers.tsx](file:///Users/zack/code/vyu/src/components/Providers.tsx)
Context providers for `next-themes` (Dark Mode) and `next-intl`.

## Verification Plan

### Automated Tests
- Verify `/en` and `/sv` routes load respective translations.
- Check that brand colors are correctly applied in a test component.

### Manual Verification
- Test Dark Mode toggle and Language switcher.
