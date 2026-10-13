import { getEntry } from "astro:content";
import type { AboutPage } from "./schema";

/** Sole consumer of the `about` content collection. Throws if missing — see invest-repository.ts for the same rationale. */
export async function getAboutPage(): Promise<AboutPage> {
  const entry = await getEntry("about", "about");
  if (!entry) {
    throw new Error("getAboutPage: the 'about' content collection has no 'about' entry");
  }
  return entry.data;
}
