# Contract: Path data-access layer

**Module**: `lib/paths/path-repository.ts` | **Consumers**: `app/page.tsx` (PathGrid), `app/paths/[pathId]/page.tsx`

This is the *only* module in the codebase permitted to read `lib/paths/paths.json`. It is the isolation boundary required by FR-020 and Constitution Principle VIII: replacing the JSON file with a Firebase-backed source in a later phase means editing only this file's internals — its exported signatures do not change.

## Types (`lib/paths/types.ts`)

```ts
export interface PathImage {
  src: string;
  alt: string;
}

export interface PathCard {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: PathImage;
  destination: string;
  targetAudience?: string;
  order?: number;
}
```

## Functions

### `getPublishedPaths(): Promise<PathCard[]>`

- Returns every `PathCard` entry whose required fields are all non-empty (see `data-model.md` "published" predicate), sorted per the ordering rule in `data-model.md`.
- Never throws for a merely-pending entry (that's expected, normal data) — it silently excludes it.
- Throws only on a structurally invalid file (malformed JSON, duplicate `id`, or a published entry whose `destination` doesn't match `/paths/${id}`) — a build-time content bug, not a runtime user-facing error.
- Used by: `app/page.tsx` to render `PathGrid`.

### `getPathById(id: string): Promise<PathCard | undefined>`

- Returns the entry matching `id`, **regardless of published/pending state** — this is what allows the dynamic route to exist even if someone navigates directly to a not-yet-published path's URL (edge case: the route handler treats "found but pending" as `notFound()`, same as "not found at all" — a pending path has no reachable public URL).
- Used by: `app/paths/[pathId]/page.tsx` to resolve the route param; calls Next.js `notFound()` when the result is `undefined` or the entry is pending.

## Consumer obligation

`PathCard`/`PathGrid` components and the destination page import **only** `PathCard`/`PathImage` types and these two functions — never `paths.json` directly, and never any Node `fs`/`path` APIs of their own. This is enforced by code review (Constitution Principle VIII), not by a lint rule in this initial phase.
