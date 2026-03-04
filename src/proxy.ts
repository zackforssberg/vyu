import { auth } from "@/auth"
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Check if it's an API route (with or without locale prefix)
  const isApiRoute = pathname.startsWith('/api') || pathname.match(/^\/(en|sv)\/api/);

  if (isApiRoute) {
    // If it has a locale prefix, redirect to the clean API route
    if (pathname.match(/^\/(en|sv)\//)) {
      const newPath = pathname.replace(/^\/(en|sv)/, '');
      const url = new URL(newPath, req.nextUrl.origin);
      url.search = req.nextUrl.search;
      return Response.redirect(url);
    }
    return; // Don't run intlMiddleware for API routes
  }

  return intlMiddleware(req);
});

export const config = {
  // Match only internationalized pathnames + auth paths
  matcher: ['/', '/(en|sv)/:path*', '/api/auth/:path*']
};
