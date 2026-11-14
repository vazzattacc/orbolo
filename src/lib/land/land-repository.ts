import { getEntry } from "astro:content";
import { localizedId, type Locale } from "@/i18n";
import type { LandPage } from "./schema";

/** Sole consumer of the `land` content collection. Throws if missing — see invest-repository.ts for the same rationale. */
export async function getLandPage(locale: Locale = "en"): Promise<LandPage> {
  const id = localizedId("land", locale);
  const entry = await getEntry("land", id);
  if (!entry) {
    throw new Error(`getLandPage: the 'land' content collection has no '${id}' entry`);
  }
  return entry.data;
}
