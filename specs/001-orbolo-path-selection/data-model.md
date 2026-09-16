# Phase 1 Data Model: Orbolo Website — Interactive Path Selection Experience

**Feature**: `001-orbolo-path-selection` | **Date**: 2026-09-14

## Entity: PathCard

Represents one selectable path in the Orbolo ecosystem. Source of truth: `lib/paths/paths.json`, accessed only through `PathRepository` (see `contracts/data-layer.md`).

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `string` | yes | Stable, unique, kebab-case slug (e.g. `"el-tapir"`, `"orbolo-bridge"`, `"remote-rancher"`, `"ganaderia-a-pasto"`, `"beef"`). Used as the dynamic route param (`/paths/[pathId]`) and as the React list key. Never reused for a different path once published. |
| `title` | `string` | yes (to be *published*) | Short card headline, e.g. "Remote Rancher". |
| `description` | `string` | yes (to be *published*) | Short-form copy shown on the card (FR-002). Long-form/extended copy, if any, is a separate `longDescription` field consumed by the destination stub page, not the card — keeps the card's own text short per FR-002 ("short description"). |
| `longDescription` | `string` | no | Optional extended copy rendered on the path's destination stub page (FR-020). Empty/absent is valid — the stub still renders with just `description`. |
| `image` | `object` | yes (to be *published*) | `{ src: string; alt: string }`. `src` is a repo-relative or remote-configured image reference (never inlined/hardcoded per FR-012/013). `alt` is mandatory, non-empty (FR-015). |
| `destination` | `string` | yes (to be *published*) | Internal route path, always of the form `/paths/{id}` (FR-022). Not a full URL — never an external domain. |
| `targetAudience` | `string` | no | Free-text descriptor (e.g. "Consumers", "Business buyers") — informational, not currently rendered on the card; reserved for future copy/segmentation use. |
| `order` | `number` | no | Optional explicit sort position within the grid. When absent, entries render in JSON declaration order. |

### Derived state: *published* vs *pending*

A `PathCard` entry is **published** (rendered in the grid) only when `title`, `description`, `image.src`, `image.alt`, and `destination` are all non-empty strings. Any entry missing one or more of those is **pending** and is filtered out by `PathRepository.getPublishedPaths()` — it is never rendered, not even as a placeholder (resolved via Clarifications, FR-018).

This is a computed predicate, not a stored field — there is no `status` enum. Rationale in `research.md` §4.

### Validation rules

- `id`: required, unique across the collection, matches `^[a-z0-9]+(-[a2-9]+)*$` (kebab-case). Enforced by a lightweight assertion in `PathRepository` at load time (throws in dev/build if violated) — not a runtime schema library (see `research.md` §8).
- `destination`: when present, must equal `/paths/${id}` exactly. `PathRepository` derives it from `id` rather than trusting a free-typed value, so a content editor cannot accidentally point a path at an external URL or a mismatched route — this is what makes FR-022 structurally guaranteed rather than merely convention.
- `image.alt`: when present, must be non-empty after trimming (enforces FR-015 — no empty alt text on a "complete" entry).

### State transitions

There is exactly one transition: **pending → published**, triggered by a content editor filling in the remaining required fields in `paths.json`. There is no published → pending transition in normal operation (removing a path is done by deleting/emptying its entry, which is the same "pending" check evaluated fresh on next read — the model has no memory of prior state, keeping `PathRepository` stateless per request/build).

## Entity: Path Configuration (collection)

The ordered array of `PathCard` entries in `lib/paths/paths.json` — the literal file `PathRepository` reads. Not a separate type; documented here because the spec calls it out as its own Key Entity (source of truth, decoupled from presentation).

- **Cardinality**: Zero or more entries. The grid, empty-state handling, and layout must not assume exactly 5 (FR-006, SC-001) — verified in `quickstart.md`.
- **Ordering**: Declaration order in the JSON array, unless an entry sets `order`, in which case entries are sorted by `order` ascending (entries without `order` keep their relative declaration order, sorted after any explicit `order` values — i.e. a stable sort with unset `order` treated as `+Infinity`).
- **Current launch set** (per spec.md Delta): `el-tapir`, `orbolo-bridge`, `remote-rancher`, `ganaderia-a-pasto`, `beef` — all published. (Historical note: `remote-rancher` was originally seeded as `verdant`, and `beef` was originally seeded pending as `business-meat`; both are now renamed/complete per the Delta.)

## Example `paths.json` shape

A published entry (all required fields present) alongside a still-*pending* entry (illustrating the FR-018 mechanism — no path in the current live data is actually pending, but the mechanism must keep working for any future entry seeded this way):

```json
[
  {
    "id": "remote-rancher",
    "title": "Remote Rancher",
    "description": "Short card copy for Remote Rancher.",
    "longDescription": "Optional extended copy for the Remote Rancher destination stub.",
    "image": { "src": "/images/paths/remote-rancher.jpg", "alt": "Descriptive alt text for Remote Rancher's photograph" },
    "destination": "/paths/remote-rancher",
    "targetAudience": "Investors",
    "order": 3
  },
  {
    "id": "future-path",
    "title": "",
    "description": "",
    "image": { "src": "", "alt": "" },
    "destination": ""
  }
]
```

The `future-path` entry above is *pending*: `PathRepository.getPublishedPaths()` excludes it until every required field is filled in.
