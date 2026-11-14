import { getEntry } from "astro:content";
import { localizedId, type Locale } from "@/i18n";
import type { AboutPage } from "./schema";

/** Sole consumer of the `about` content collection. Throws if missing — see invest-repository.ts for the same rationale. */
export async function getAboutPage(locale: Locale = "en"): Promise<AboutPage> {
  const id = localizedId("about", locale);
  const entry = await getEntry("about", id);
  if (!entry) {
    throw new Error(`getAboutPage: the 'about' content collection has no '${id}' entry`);
  }
  return entry.data;
}
