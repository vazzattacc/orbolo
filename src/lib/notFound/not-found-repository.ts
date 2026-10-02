import { getEntry } from "astro:content";

export interface NotFoundContent {
  heading: string;
  body: string;
  homeLinkLabel: string;
}

/**
 * Sole consumer of the `notFound` content collection. Throws if the single
 * entry is missing — the 404 page cannot meaningfully render without it,
 * same "always expected to exist" contract as 002's settings repository.
 */
export async function getNotFoundContent(): Promise<NotFoundContent> {
  const entry = await getEntry("notFound", "notFound");
  if (!entry) {
    throw new Error("getNotFoundContent: the 'notFound' content collection has no 'notFound' entry");
  }
  return {
    heading: entry.data.heading,
    body: entry.data.body,
    homeLinkLabel: entry.data.homeLinkLabel,
  };
}
