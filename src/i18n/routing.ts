export const LOCALES = ["en", "es", "de"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  es: "Español",
  de: "Deutsch",
};

export function localizedPath(locale: Locale, path: string): string {
  const trimmed = path.startsWith("/") ? path.slice(1) : path;
  return `/${locale}${trimmed ? `/${trimmed}` : ""}`;
}

/** hreflang tags for the given page path (without locale prefix), FR-038/FR-040. */
export function hreflangLinks(path: string): { hreflang: string; href: string }[] {
  return LOCALES.map((locale) => ({ hreflang: locale, href: localizedPath(locale, path) }));
}
