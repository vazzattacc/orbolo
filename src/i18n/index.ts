/**
 * English / Spanish. English is the default and keeps the site's original
 * URLs (/, /invest, …); Spanish lives under /es (/es, /es/invest, …).
 * The locale is read from the URL rather than passed down as props, so any
 * component can ask for it with useI18n(Astro.url).
 */
import { ui, type UiStrings } from "./ui";

export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

const PREFIX = "/es";

/** Routes that exist in both languages. Privacy, Terms and 404 are English only. */
export const LOCALIZED_ROUTES = ["/", "/invest", "/beef", "/land", "/about", "/contact", "/contact/thanks", "/contact/error"];

export function isLocalizedRoute(route: string): boolean {
  return LOCALIZED_ROUTES.includes(route);
}

export function getLocale(url: URL): Locale {
  return url.pathname === PREFIX || url.pathname.startsWith(`${PREFIX}/`) ? "es" : "en";
}

/** The route with any locale prefix removed: "/es/invest/" → "/invest", "/es" → "/". */
export function stripLocale(pathname: string): string {
  let path = pathname;
  if (path === PREFIX || path.startsWith(`${PREFIX}/`)) path = path.slice(PREFIX.length) || "/";
  if (path.length > 1) path = path.replace(/\/$/, "");
  return path;
}

/**
 * An internal link for the given locale. Anchors, external URLs and
 * anything not starting with "/" pass through untouched, so content can
 * keep writing plain English routes ("/contact", "#closing").
 */
export function localizePath(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const base = stripLocale(href);
  if (locale === DEFAULT_LOCALE) return base;
  return base === "/" ? PREFIX : `${PREFIX}${base}`;
}

/** Content-collection entry id for a page in a locale: "invest" / "invest-es". */
export function localizedId<T extends string>(base: T, locale: Locale): T | `${T}-es` {
  return locale === DEFAULT_LOCALE ? base : `${base}-es`;
}

/** getStaticPaths for pages under src/pages/[...lang]: the root (English) and /es. */
export function localeStaticPaths() {
  return [{ params: { lang: undefined } }, { params: { lang: "es" } }];
}

export function useI18n(url: URL): { locale: Locale; t: UiStrings; path: (href: string) => string } {
  const locale = getLocale(url);
  return { locale, t: ui[locale], path: (href) => localizePath(href, locale) };
}
