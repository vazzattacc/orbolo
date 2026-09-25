import { getEntry } from "astro:content";
import type { InvestPage } from "./schema";

/**
 * Sole consumer of the `invest` content collection. Throws if the single
 * entry is missing — unlike Metric/RanchCard, Invest's own page content is
 * not an optional, tolerate-zero-entries collection; the page can't render
 * at all without it.
 */
export async function getInvestPage(): Promise<InvestPage> {
  const entry = await getEntry("invest", "invest");
  if (!entry) {
    throw new Error("getInvestPage: the 'invest' content collection has no 'invest' entry");
  }
  return entry.data;
}
