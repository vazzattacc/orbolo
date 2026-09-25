import { getEntry } from "astro:content";
import type { LandPage } from "./schema";

/** Sole consumer of the `land` content collection. Throws if missing — see invest-repository.ts for the same rationale. */
export async function getLandPage(): Promise<LandPage> {
  const entry = await getEntry("land", "land");
  if (!entry) {
    throw new Error("getLandPage: the 'land' content collection has no 'land' entry");
  }
  return entry.data;
}
