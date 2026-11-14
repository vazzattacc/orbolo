import { getEntry } from "astro:content";
import { localizedId, type Locale } from "@/i18n";
import type { BeefPage } from "./schema";

/** Sole consumer of the `beef` content collection. Throws if missing — see invest-repository.ts for the same rationale. */
export async function getBeefPage(locale: Locale = "en"): Promise<BeefPage> {
  const id = localizedId("beef", locale);
  const entry = await getEntry("beef", id);
  if (!entry) {
    throw new Error(`getBeefPage: the 'beef' content collection has no '${id}' entry`);
  }
  return entry.data;
}
