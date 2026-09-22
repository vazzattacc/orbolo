# Contract: Path data-access layer

**Collection**: `src/content.config.ts` (`paths`) | **Module**: `src/lib/paths/path-repository.ts` | **Consumer**: `src/pages/index.astro` (renders `PathGrid`)

The `paths` Astro Content Collection, backed by `src/content/paths/paths.json` via Astro's built-in `file()` loader, is the *only* place `paths.json` is read. `path-repository.ts` wraps `getCollection('paths')` and is the *only* module permitted to call it. This two-layer isolation is the boundary required by FR-021 and Constitution Principle VIII: replacing the JSON-backed loader with a Firebase-backed one later means editing only the collection's `loader` (and, if needed, `path-repository.ts`'s internals) — its exported signature does not change, and no `PathCard`/`PathGrid` consumer is touched.

## Schema (`src/content.config.ts`)

```ts
import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const paths = defineCollection({
  loader: file('src/content/paths/paths.json'),
  schema: z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(1),
    description: z.string().min(1),
    image: z.object({
      src: z.string().min(1),
      alt: z.string().min(1),
    }),
    destination: z.string().startsWith('/'),
    targetAudience: z.string().min(1),
    order: z.number().finite().optional(),
  }),
});

export const collections = { paths };
```

## Types (derived from the schema; re-exported from `src/lib/paths/path-repository.ts`)

```ts
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
```

## Functions

### `getPaths(): Promise<PathCard[]>`

- Returns every entry in the `paths` collection, mapped from `CollectionEntry<'paths'>` to the plain `PathCard` shape above (unwrapping Astro's `entry.data`), sorted by `order` ascending where present, falling back to file order otherwise (see `data-model.md`).
- Does **not** filter by a "published" state — unlike the prior 5-path spec, all three current entries are fully specified; there is no pending/hidden card to exclude in this revision.
- Throws only on a schema validation failure (malformed JSON, duplicate `id`, or a `destination` that isn't schema-valid — e.g. missing the leading `/`) — a build-time content bug (`astro check`/build fails loudly), not a runtime user-facing error.
- Used by: `src/pages/index.astro` to render `PathGrid`.

## Consumer obligation

`PathCard`/`PathGrid` components import **only** the `PathCard`/`PathImage` types and `getPaths()` from `src/lib/paths/path-repository.ts` — never `astro:content`'s `getCollection`/`paths.json` directly, and never any Node `fs`/`path` APIs of their own. This is enforced by code review (Constitution Principle VIII), not by a lint rule in this initial phase.
