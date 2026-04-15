import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./i18n/config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export function proxy(request: Parameters<typeof intlMiddleware>[0]) {
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - api routes
    // - _next (Next.js internals)
    // - admin and login pages
    // - static files (images, fonts, favicon)
    "/((?!api|_next|admin|login|images|fonts|favicon.ico|.*\\..*).*)",
  ],
};
