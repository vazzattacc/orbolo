# Phase 1 Data Model: Site Launch Essentials

Three new content collections (`pageMeta`, `notFound`, `legal`) plus an extension of the existing `settings` singleton (from `002`) — no other existing collection is touched. `FooterLink` (spec.md Key Entities) is **not** a stored entity — see `research.md` §5.

## PageMeta

One entry per public route. Backs `FR-SEO-001`–`005`.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | Route slug, e.g. `"home"`, `"invest"`, `"privacy"` — file-loader identity |
| `route` | string | yes | The actual path, e.g. `"/"`, `"/invest"`, `"/privacy"` |
| `description` | string | yes | 120–160 chars (`FR-SEO-002`); Vaz-approved at the implementation review gate, not auto-generated |
| `indexable` | boolean | yes | `false` only for the not-found page; `true` for every other entry |

`canonicalUrl` (named in spec.md's entity) is **not** a stored field — computed as `new URL(route, Astro.site).href` at render time (`research.md` §8), so it can never drift from `site` in `astro.config.mjs`.

**Known entries at launch**: `home` (`/`), `invest` (`/invest`), `beef` (`/beef`), `land` (`/land`), `contact` (`/contact`) — all `indexable: true`. `privacy`/`terms` entries are added only once their `LegalDocument` is approved (see below); the not-found page is handled directly in `404.astro`, not via this collection (it has no route to be "found" at).

## NotFoundContent

Single-entry collection. Backs `FR-404-002`.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | literal `"notFound"` | yes | |
| `heading` | string | yes | e.g. "Page not found" |
| `body` | string | yes | One short explanatory sentence — no invented claims or numbers (`FR-404-004`) |
| `homeLinkLabel` | string | yes | e.g. "Back to Home" |

## LegalDocument

Zero, one, or two entries (`privacy` | `terms`) — absence is a valid, expected state (`FR-LEG-004`). Backs `FR-LEG-002`–`007`.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | literal `"privacy"` \| `"terms"` | yes | |
| `sourceUrl` | string | yes | The exact `orbolo.com` URL the text was fetched from |
| `fetchedOn` | string (ISO date) | yes | |
| `sourceLastUpdated` | string | no | The source page's own stated date, if any — else `fetchedOn` is shown as "fetched" (`FR-LEG-006`) |
| `body` | array of `{heading, paragraphs: string[]}` | yes | Structured to preserve headings/clause numbering/lists (`FR-LEG-003`) — not a single opaque markdown blob, so headings render as real `<h2>`s |
| `approved` | boolean | yes | Gates shipping (`FR-LEG-007`); `false` until Vaz approves — see `getLegalDocument()`'s contract |
| `reviewNotes` | array of strings | yes | The `FR-LEG-005` list — may be empty, but the field always exists so "no notes" is explicit, not absent |

**Validation**: `body` must have at least one entry; `reviewNotes` may be `[]` but must be present — an implementer who found zero flaggable passages still records that explicitly, rather than the field being ambiguously omitted.

## Settings (extended — `002`'s existing singleton)

Three new required fields added to the collection `002` already created (the single `settings.json` entry is updated to include them); `contractingEntityName` (from `002`) and its `getContractingEntityName()` reader are untouched — a second reader function, `getSocialPreviewDefaults()`, is added alongside it (see `contracts/page-meta-schema.md`).

| Field | Type | Required | Notes |
|---|---|---|---|
| `contractingEntityName` | string | yes | *(existing, from 002 — unchanged)* |
| `siteName` | string | yes (new) | `"Orbolo"` — `FR-SEO-003`'s `og:site_name` |
| `socialImagePath` | string | yes (new) | `/images/social/og-default.png` |
| `socialImageAlt` | string | yes (new) | Meaningful alt text for the shared preview image — `FR-QA-002` |

## Cross-cutting rules

- Every `PageMeta.description` and every `LegalDocument` entry is authored content, not generated — per `FR-GEN3-004`, run through the same banned-word/voice rules as `002`'s content (English only, no §B2.6 words, no "Orbolo collects capital" phrasing) **except** `LegalDocument.body`, which is explicitly exempt from the banned-word rewrite (`FR-LEG-005`, spec.md Edge Cases) — flagged, never silently rewritten.
- `getLegalDocument(kind)` returns `undefined` whenever the entry is missing **or** `approved` is `false` — see `contracts/footer-and-legal-gating.md`. This is the single source of truth `Footer.astro`, `privacy.astro`, and `terms.astro` all consult; none of them re-implements the gating check independently.
