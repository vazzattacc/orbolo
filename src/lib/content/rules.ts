import type { Locale } from "@/i18n/routing";

export interface RuleView {
  number: string;
  rule: string;
  verifiedHow: string;
  verifier: string;
  terms: string[];
  locale: Locale;
}

async function getAllRuleEntries(): Promise<{ id: string; data: RuleView }[]> {
  const { getCollection } = await import("astro:content");
  return getCollection("rules");
}

/** One entry per rule number, in `locale` where available, English otherwise (FR-039). */
export async function getAllRules(locale: Locale = "en"): Promise<{ id: string; data: RuleView }[]> {
  const all = await getAllRuleEntries();
  const englishRules = all.filter((entry) => entry.data.locale === "en");
  return englishRules.map(
    (english) => all.find((entry) => entry.data.number === english.data.number && entry.data.locale === locale) ?? english,
  );
}

export async function getRulesBySlug(slugs: string[], locale: Locale = "en"): Promise<RuleView[]> {
  const all = await getAllRules(locale);
  return slugs
    .map((slug) => all.find((entry) => entry.id === slug || entry.data.number === slug)?.data)
    .filter((rule): rule is RuleView => Boolean(rule));
}
