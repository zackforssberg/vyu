# Phase 1.3: Internationalization (i18n) Implementation Plan

Enable multi-language support (English & Swedish) using `next-intl` with localized routing.

## Proposed Changes

### [Component] i18n & Routing
Setup `next-intl` with localized routing and message loading.

#### [NEW] [en.json](file:///Users/zack/code/vyu/messages/en.json) & [sv.json](file:///Users/zack/code/vyu/messages/sv.json)
Initial dictionaries for English and Swedish.

#### [NEW] [routing.ts](file:///Users/zack/code/vyu/src/i18n/routing.ts) & [request.ts](file:///Users/zack/code/vyu/src/i18n/request.ts)
Configuration for locales and message loading.

#### [MOVE] [src/app/](file:///Users/zack/code/vyu/src/app/) -> [src/app/[locale]/](file:///Users/zack/code/vyu/src/app/[locale]/)
Localized routing structure using the `[locale]` dynamic segment.

#### [NEW] [middleware.ts](file:///Users/zack/code/vyu/src/middleware.ts) (or proxy.ts update)
Middleware to handle locale detection and redirection.

## Verification Plan

### Automated Tests
- Verify `/en` and `/sv` routes load respective translations.
- Check that the default locale correctly redirects if the user has a preference or if no locale is provided.

### Manual Verification
- Test the language switcher functionality.
- Verify that UI elements update immediately when the language is changed.
