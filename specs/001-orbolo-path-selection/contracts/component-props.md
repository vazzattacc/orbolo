# Contract: UI component props

## `PathGrid`

`src/components/home/PathGrid.astro`

```ts
interface Props {
  paths: PathCard[]; // resolved entries, fetched by the caller via getPaths()
}
```

- Purely presentational: receives data, renders one `PathCard` per entry. Contains no data-fetching, no knowledge of JSON/Firebase/content collections, no per-audience conditional logic (no `if (path.id === 'buyers')` branches anywhere — that would violate FR-007).
- Responsive layout (desktop/tablet/mobile) lives here via Tailwind responsive classes (FR-012/013) — not in `PathCard`. Uses an auto-fit/wrap strategy rather than a hardcoded 3-column grid, per `research.md` §8, so it degrades gracefully if fewer than 3 entries are ever configured.
- Renders nothing (empty grid, no error) when `paths` is an empty array.

## `PathCard`

`src/components/home/PathCard.astro`

```ts
interface Props {
  path: PathCard; // one entry
}
```

- Root element: a `<div>` (or `<article>`) wrapping two faces — never itself a navigable element, since the card as a whole is not a link (FR-004/FR-014).
- **Front face**: a real `<button type="button" aria-expanded="false" aria-controls="{path.id}-back">` as the flip trigger, wrapping the image + `path.title` + `path.description` teaser (FR-016). No `onClick`-only `<div>` — the trigger is a semantic, keyboard-operable control from the start.
- **Back face**: `id="{path.id}-back"`, `hidden` (or visually hidden via CSS driven by the same state) until flipped, containing the expanded `path.description` (same value as the front-face teaser, per `data-model.md`) and a real `<a href={path.destination}>Discover more</a>` — "Discover more" is a fixed UI string, not `PathCard` data. The anchor is always present in the DOM, flip state or not (FR-024).
- Renders `path.image.src`/`path.image.alt`, with an inline `onerror` fallback per `research.md` §5 — no per-card fallback asset required.
- Displays `path.title` and `path.description` verbatim — no audience-specific copy, casing, or truncation logic embedded in the component (FR-007/FR-014).
- Visible states required: default, `:hover`, `:focus-visible`, flipped-open — all via CSS/Tailwind variants driven by the trigger's `aria-expanded` attribute, none communicated by color alone (FR-010/FR-018); no state depends on JS-only hover detection (FR-011).
- Contains no client-side selection logic of its own — the flip toggle and focus management are handled by the shared `src/scripts/path-card-flip.ts` script (per `research.md` §2), which this component opts into via a shared class/data-attribute, not by embedding component-local script logic per card instance.
- Accepts no `onClick`/navigation prop for the card root — navigation happens exclusively via the back face's real anchor.
