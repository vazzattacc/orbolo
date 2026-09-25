import { getEntry } from "astro:content";
import type { BeefPage } from "./schema";

/** Sole consumer of the `beef` content collection. Throws if missing — see invest-repository.ts for the same rationale. */
export async function getBeefPage(): Promise<BeefPage> {
  const entry = await getEntry("beef", "beef");
  if (!entry) {
    throw new Error("getBeefPage: the 'beef' content collection has no 'beef' entry");
  }
  return entry.data;
}
