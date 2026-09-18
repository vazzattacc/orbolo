import { getCollection } from "astro:content";
import type { Locale } from "@/i18n/routing";

export interface TermView {
  term: string;
  definition: string;
  measuredBy: string;
  notThis: string;
  group?: string;
  locale: Locale;
}

/**
 * Case-insensitive lookup (FR-024), locale-aware with English fallback:
 * FR-039 requires the Glossary to be translated first and fully, but a
 * translation gap here must fall back to English rather than disappear.
 */
export async function getGlossaryTerm(term: string, locale: Locale = "en"): Promise<TermView | undefined> {
  const entries = await getCollection("terms");
  const lower = term.toLowerCase();
  const localized = entries.find((entry) => entry.data.term.toLowerCase() === lower && entry.data.locale === locale);
  if (localized) return localized.data;
  return entries.find((entry) => entry.data.term.toLowerCase() === lower && entry.data.locale === "en")?.data;
}

/** One entry per logical term, in `locale` where available, English otherwise. */
export async function getAllGlossaryTerms(locale: Locale = "en"): Promise<TermView[]> {
  const entries = (await getCollection("terms")).map((entry) => entry.data);
  const englishTerms = entries.filter((entry) => entry.locale === "en");
  return englishTerms.map((english) => entries.find((entry) => entry.term === english.term && entry.locale === locale) ?? english);
}
