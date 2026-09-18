import { getEntry } from "astro:content";
import { sectionSchema } from "@/content/config";
import type { z } from "astro:content";

export type Section = z.infer<typeof sectionSchema>;
export type Locale = "en" | "es" | "de";

export interface PageView {
  slug: string;
  title: string;
  seoDescription?: string;
  sections: Section[];
  locale: Locale;
  /** true when the requested locale had no published version and the
   * default locale's content is being shown instead (FR-003). Callers MUST
   * surface this to the visitor rather than presenting it as finished. */
  isFallback: boolean;
}

const DEFAULT_LOCALE: Locale = "en";
const COLLECTION_BY_LOCALE = {
  en: "pages_en",
  es: "pages_es",
  de: "pages_de",
} as const;

async function readPublished(slug: string, locale: Locale) {
  const entry = await getEntry(COLLECTION_BY_LOCALE[locale], slug);
  if (!entry || entry.data.status !== "published") return undefined;
  return entry;
}

/**
 * Returns the page for `slug`+`locale` only if published for that locale;
 * otherwise falls back to the default locale's published version with
 * `isFallback: true`. Never returns a draft as if it were finished (FR-003).
 */
export async function getPage(slug: string, locale: Locale): Promise<PageView | undefined> {
  const direct = await readPublished(slug, locale);
  const entry = direct ?? (locale !== DEFAULT_LOCALE ? await readPublished(slug, DEFAULT_LOCALE) : undefined);
  if (!entry) return undefined;

  const sections = JSON.parse(entry.data.sectionsJson) as unknown[];
  const parsed = sections.map((section) => sectionSchema.parse(section));

  return {
    slug: entry.data.slug,
    title: entry.data.title,
    seoDescription: entry.data.seoDescription,
    sections: parsed,
    locale,
    isFallback: !direct,
  };
}
