import { getCollection } from "astro:content";

export interface PathImage {
  src: string;
  alt: string;
}

export interface PathCard {
  id: string;
  title: string;
  description: string;
  image: PathImage;
  destination: string;
  targetAudience: string;
  order?: number;
}

/**
 * Sole consumer of the `paths` content collection. `PathCard`/`PathGrid` and
 * any future consumer import only this function — never `astro:content` or
 * `paths.json` directly — so the collection's loader can later be swapped
 * for a Firebase-backed one with no change to this signature.
 */
export async function getPaths(): Promise<PathCard[]> {
  const entries = await getCollection("paths");

  return entries
    .map((entry): PathCard => ({
      id: entry.data.id,
      title: entry.data.title,
      description: entry.data.description,
      image: entry.data.image,
      destination: entry.data.destination,
      targetAudience: entry.data.targetAudience,
      order: entry.data.order,
    }))
    .sort((a, b) => {
      if (a.order === undefined && b.order === undefined) return 0;
      if (a.order === undefined) return 1;
      if (b.order === undefined) return -1;
      return a.order - b.order;
    });
}
