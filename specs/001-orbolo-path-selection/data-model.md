# Phase 1 Data Model: Orbolo Website — Home Page Audience-Path Selector

**Feature**: `001-orbolo-path-selection` | **Date**: 2026-09-19

## PathCard

Represents one selectable audience path on the Home page's selection section.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `string` (slug) | yes | Stable identifier; also used as the DOM id root for the flip trigger/panel pairing (`aria-controls`) |
| `title` | `string` | yes | Front- and back-face title (e.g. "Buyers") |
| `description` | `string` | yes | Used for both the front-face teaser and the back-face expanded text (spec: "The same `description` value is used for both") |
| `image` | `PathImage` | yes | See below |
| `destination` | `string` (internal path, starts with `/`) | yes | MUST resolve to an internal route of this site (FR-023) — never an external URL |
| `targetAudience` | `string` | yes | e.g. "Investors", "Buyers", "Landowners" — the audience label, distinct from `title` which is the destination's own name (e.g. Invest/Remote Rancher) |
| `order` | `number` | no | Optional explicit ordering; entries without it render in file order |

```ts
export interface PathImage {
  src: string;   // path under public/images/paths/, referenced by string per constitution Assets note
  alt: string;   // non-empty; required for FR-017
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

Notes carried over from the spec's Key Entities section:
- The "Discover more" label shown on a flipped card's back face is a **fixed UI string**, not a `PathCard` attribute — it is not part of this schema.
- There is no separate `longDescription` field in this revision (unlike the prior 5-path spec's schema): the spec is explicit that front and back faces share the same `description` value.

### Validation rules

Enforced at the content-collection boundary (Astro Content Collections' Zod schema, `src/content.config.ts`) so no invalid entry can reach a component:

- `id`: non-empty, unique across all entries, URL-safe slug (`^[a-z0-9-]+$`).
- `title`, `description`, `targetAudience`: non-empty strings.
- `image.src`: non-empty string; `image.alt`: non-empty string (FR-017 — alt text is mandatory, not optional).
- `destination`: non-empty string, must start with `/` (enforces FR-023's "internal route only" at the schema level — an absolute `https://...` URL fails validation rather than silently shipping an external redirect).
- `order`: if present, a finite number; entries are sorted by `order` ascending when present, falling back to file order for entries that omit it.

A schema validation failure is a **build-time content bug** (malformed JSON, duplicate `id`, or an external `destination`), not a runtime user-facing error — `astro check`/the build fails loudly rather than rendering a broken card, consistent with the constitution's single-verification-command gate (`pnpm run verify`).

### Rendering completeness

Unlike the prior 5-path spec (which had a "published vs. pending" filter for the still-incomplete Business/Meat path), this revision's three cards are each fully specified from the outset — there is no partial/hidden-until-complete state to model. `PathGrid` simply renders every entry the `paths` collection returns (see `research.md` §8 for the "fewer than 3" degradation behavior); no `published` flag exists in this schema.

## Path Configuration (collection)

The ordered list of `PathCard` entries feeding the selection section — the source of truth for content, decoupled from presentation/interaction logic (Constitution Principle VIII). Lives in `src/content/paths/paths.json`, versioned in the repository, accessed only through the `paths` Astro Content Collection + `src/lib/paths/path-repository.ts` (see `contracts/data-layer.md`).

Currently exactly three entries:

| `id` | `targetAudience` | `title` | `destination` |
|---|---|---|---|
| `investors` | Investors | Invest (Remote Rancher) | `/invest` |
| `buyers` | Buyers | Beef | `/beef` |
| `landowners` | Landowners | Land | `/land` |

(Exact `destination` slugs are placeholders pending confirmation against the site's real route map when the Invest/Beef/Land pages are built — this feature only requires that each resolves internally, per FR-023, not that those target pages exist yet within this feature's own scope.)

## Interaction state (not persisted)

Ephemeral, client-only UI state — explicitly out of the data model / configuration layer, per spec Non-goals ("Persisting a card's flipped/open state across page loads, or between visitors"):

- `flipped: boolean` per card instance, always `false` on load, held in the DOM via the flip trigger's `aria-expanded` attribute — not in `PathCard` data, not in any store, not synced across visitors or reloads.
