import { getCollection } from "astro:content";

export interface PageMeta {
  route: string;
  description: string;
  indexable: boolean;
}

/**
 * Sole consumer of the `pageMeta` content collection. Looks up by `route`
 * (not the collection's internal `id`) since every caller already has
 * Astro.url.pathname on hand. Returns `undefined` if no entry exists for
 * that route — callers MUST still render the page (never block on missing
 * metadata), though every *shipped* page is expected to have an entry
 * (SC-002).
 */
export async function getPageMeta(route: string): Promise<PageMeta | undefined> {
  const entries = await getCollection("pageMeta");
  const entry = entries.find((e) => e.data.route === route);
  if (!entry) return undefined;

  return {
    route: entry.data.route,
    description: entry.data.description,
    indexable: entry.data.indexable,
  };
}
