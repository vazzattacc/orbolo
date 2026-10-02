import { getEntry } from "astro:content";

export interface LegalDocument {
  sourceUrl: string;
  fetchedOn: string;
  sourceLastUpdated?: string;
  body: { heading: string; paragraphs: string[] }[];
  reviewNotes: string[];
}

/**
 * Sole consumer of the `legal` content collection, shared by Footer.astro,
 * privacy.astro, and terms.astro. Returns `undefined` whenever the
 * document doesn't exist (FR-LEG-004: not found/fetchable on orbolo.com)
 * OR exists but isn't yet approved (FR-LEG-007) — both collapse to the
 * same "not shippable yet" signal. `approved` itself is never exposed:
 * there is nothing a caller should do with `approved: false` except treat
 * it exactly like "doesn't exist" (research.md §5).
 */
export async function getLegalDocument(kind: "privacy" | "terms"): Promise<LegalDocument | undefined> {
  const entry = await getEntry("legal", kind);
  if (!entry || !entry.data.approved) return undefined;

  return {
    sourceUrl: entry.data.sourceUrl,
    fetchedOn: entry.data.fetchedOn,
    sourceLastUpdated: entry.data.sourceLastUpdated,
    body: entry.data.body,
    reviewNotes: entry.data.reviewNotes,
  };
}
