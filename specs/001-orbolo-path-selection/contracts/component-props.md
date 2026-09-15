# Contract: UI component props

## `PathGrid`

`components/PathGrid.tsx`

```ts
interface PathGridProps {
  paths: PathCard[]; // already-published entries, fetched by the caller via getPublishedPaths()
}
```

- Purely presentational: receives data, renders one `PathCard` per entry. Contains no data-fetching, no knowledge of JSON/Firebase, no per-path conditional logic (no `if (path.id === 'verdant')` branches anywhere — that would violate FR-005).
- Responsive layout (desktop/tablet/mobile) lives here via Tailwind responsive classes (FR-010/011) — not in `PathCard`.
- Renders nothing (empty grid, no error) when `paths` is an empty array — the spec's edge case "fewer than 5 configured paths" must not crash or show placeholder cards.

## `PathCard`

`components/PathCard.tsx`

```ts
interface PathCardProps {
  path: PathCard; // one published entry
}
```

- Root element: `<Link href={path.destination}>` (Next.js `Link`, renders a real `<a>`) — never a `<div onClick>` (FR-014/023).
- Renders `path.image` via `next/image`, with an `onError` fallback per `research.md` §5 — no per-path fallback asset required.
- Displays `path.title` and `path.description` verbatim — no path-specific copy, casing, or truncation logic embedded in the component (FR-005/012).
- Visible states required: default, `:hover`, `:focus-visible`, `:active` (pressed/selected) — all via Tailwind variants, no state driven by JS-only hover detection (FR-008/009).
- Accepts no `onClick` prop and performs no client-side-only selection logic — selection *is* navigation (per the clarified real-URL-navigation decision), so there is nothing else for a consumer to wire up.

## Destination stub page

`app/paths/[pathId]/page.tsx` (not a reusable component — a route-level Server Component)

- Reads `params.pathId`, calls `getPathById`, calls `notFound()` if missing or pending.
- Renders a shared generic template: hero `image`, `title`, `description`, optional `longDescription` — the same template for every path, no per-path branching (keeps FR-005's "no business logic specific to any individual path" true for destinations too, not just the grid).
