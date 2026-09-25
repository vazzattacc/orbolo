# Phase 0 Research: Invest, Beef & Land Page Content Structure

`spec.md` left no `NEEDS CLARIFICATION` markers — all 17 Open Questions were resolved, partially resolved, or deliberately deferred with the user (2026-09-22 through 2026-09-24) before this plan started. This document instead records the implementation-approach decisions `plan.md` depends on, each with rationale and the alternative rejected.

## 1. Content architecture: one typed JSON file per page, not a generic `sections[]` array

**Decision**: `src/content/invest/invest.json`, `beef/beef.json`, `land/land.json` — each a single object whose top-level keys map 1:1 to that page's named `FR-*` sections (e.g. `invest.json` has `hero`, `offerBox`, `isThisReal`, ...), validated by a page-specific Zod object schema.

**Rationale**: `spec.md`'s `PageSection` entity is explicitly annotated "this is the spec's own bookkeeping construct, not a proposal for a new code entity" — it's a planning device (id/heading/purpose/briefSource/status), not a schema to implement literally. Combined with `FR-GEN-002`'s requirement that sections render "in the order listed" (a fixed, spec-defined order, not CMS-reorderable), a generic `sections: {type, ...}[]` array plus a type-dispatching renderer would add real complexity (a discriminated union, a `SectionRenderer` component, per-type prop shapes) to solve a reordering/extensibility problem this feature doesn't have. A flat, named-field object per page is simpler, gives each field its own precise Zod type, and is trivially diffable against the FR list it implements.

**Alternative considered**: A generic `Section` discriminated union (`{type: "hero", ...} | {type: "offerBox", ...} | ...`) rendered by a shared `SectionRenderer`, closer to a CMS-like model. Rejected — over-engineered for three pages with a fixed, non-reorderable section set and no CMS in this feature's scope (`spec.md` Non-goals).

## 2. `Metric` entity: reuse the "omit if unsourced" pattern

**Decision**: A small shared `metrics` collection (`src/content/metrics/metrics.json`), one entry per number: `{key, value, unit, asOfDate, sourceDocumentRef}`. A `getMetric(key)` repository function returns `undefined` — never a partially-filled object — when `asOfDate` or `sourceDocumentRef` is missing, so a template can never accidentally render a number with no date/source attached. Pages reference metrics by `key` (e.g. `elTapirHectares`, `gappHectares`, `animalCount`) rather than inlining the value.

**Rationale**: This directly implements `FR-GEN-005` ("every displayed number MUST carry a visible date and source, or MUST NOT be displayed") as a structural guarantee enforced in one place, not a convention every page template has to remember. It also gives every number here (El Tapir's 1,000 ha, Ganadería a Pasto's 35,000 ha, the "500+ animals and growing" count — all Vaz-confirmed 2026-09-23/24) one canonical, re-usable source, matching `spec.md`'s own note that the animal count is "a general company fact, not tied to one section."

**Alternative considered**: Inlining each number directly into its page's JSON (e.g. `elTapir.hectares: 1000`) with a sibling `elTapirHectaresAsOf`/`elTapirHectaresSource` field per number. Rejected — scatters the same enforcement logic across every page's schema instead of centralizing it once, and makes it harder to reuse one number (the animal count) across pages later without duplicating it.

## 3. Site navigation: hardcoded in `Nav.astro`, not a content collection

**Decision**: The nav bar's link set (Home, Invest, Beef, Land, Contact) is a plain array literal inside `Nav.astro`, not JSON content.

**Rationale**: `spec.md`'s `SiteNav` entity is explicitly "the spec's bookkeeping construct for FR-GEN-009, not a proposal for a new code entity." The list is small, fixed, and — per `FR-GEN-009` — only grows when a new page actually ships (a code-level event requiring a new route regardless), not something a non-technical editor needs to reconfigure independently of the pages that exist. Making it a content collection would add a layer of indirection with no corresponding flexibility gained.

**Alternative considered**: A `siteNav.json` content collection. Rejected for the reason above — no real editability need it serves that a code change doesn't already require.

## 4. Hidden-vs-visible: plain conditional rendering, no placeholder component

**Decision**: A section with no real backing data is omitted via a plain Astro conditional (`{data.offerBoxTerms && <OfferBoxTerms .../>}` or, more commonly here, the whole page-content JSON simply omits the key and the component tree checks for its presence) — never rendered as an empty shell, a skeleton, or a "coming soon" message.

**Rationale**: Confirmed explicitly by Vaz 2026-09-24 (`spec.md` Clarifications, Session 2026-09-24) as a hard requirement, matching the brief's own B4 rule. No new component or CSS state is needed — this is Astro's native conditional-render behavior, the same mechanism `PathGrid.astro` already uses (`paths.length > 0 && (...)`) to handle a possibly-empty collection.

**Alternative considered**: A dedicated `<PendingSection />` placeholder component showing a "content coming soon" message. Rejected outright by the 2026-09-24 clarification.

## 5. `RanchCard`: schema + empty collection now, ready for real data later

**Decision**: `src/content/ranches/ranches.json` starts as `[]`. The schema (codename, region, hectares, grazingSystem, yearsInTransition, mpcsStatus, checklistFlags, threshold, committedUnderLoi, status, updatedDate) is defined now so a future content update needs zero code changes to appear — matching Constitution Principle VIII exactly the way `001`'s `paths` collection tolerates zero-to-many entries.

**Rationale**: `OQ-008` and `OQ-013` were both confirmed 2026-09-24 as "deliberately no data, not invented" — the Deployment Pipeline (Invest) and Partner ranches (Land) sections must exist structurally (their components must be buildable and tested) without any real ranch yet. An empty, schema-validated collection is the same "tolerate zero-to-many" pattern already proven, not a new one.

**Alternative considered**: Deferring the schema/collection entirely until real data exists. Rejected — `FR-INV-008`/`FR-LAND-002` are still real requirements this feature must satisfy structurally (component exists, is tested for the empty case, hides correctly), even though no content exists to fill it yet.

## 6. `ContractingEntity`: a one-field settings JSON, not a hardcoded string

**Decision**: `src/content/settings/settings.json` holds `{contractingEntityName: "Orbolo"}`, read through `getContractingEntityName()`. `FR-INV-012`'s footer line reads this value rather than a literal string in the component.

**Rationale**: Keeps the one resolved fact (`OQ-001`) in the content layer alongside everything else, consistent with Constitution Principle VIII — if Vaz later supplies a fuller legal name (e.g. "Orbolo Paraguay S.A."), that's a content edit, not a component edit.

**Alternative considered**: A literal string in `FR-INV-012`'s component. Rejected — a single real fact still belongs in the content layer, not templates, per the constitution's own decoupling principle; the volume being small doesn't change which layer it belongs in.

## 7. Contact page: a minimal stub, reusing `001`'s own placeholder pattern

**Decision**: `src/pages/contact.astro` is a minimal page using the exact same "This is a placeholder destination..." pattern `001` used for Invest/Beef/Land before this feature filled them in — not a broken link, not a JS alert, not a real form.

**Rationale**: `OQ-015` confirmed the nav's Contact link exists now, pointing at a stub, with its real destination/form still pending. A dead `#` link or an unstyled 404 would be worse than reusing a pattern this exact codebase already established and tested for precisely this "route exists, real content doesn't yet" situation.

**Alternative considered**: Omitting the route and letting the link 404. Rejected — `SC-007` requires the Contact link to be reachable "in one click," which a 404 technically satisfies but defeats the purpose of a persistent, always-reachable contact path.

## 8. Fonts, colors, design tokens: no changes

**Decision**: `src/styles/global.css`'s existing `@theme` block (`--color-orbolo-green`, `--color-orbolo-cream`, the four font roles) is used as-is. No new token, no new font file.

**Rationale**: `FR-GEN-001` explicitly freezes design tokens for this feature, with only the nav bar as a scoped exception (which itself uses the existing tokens, not new ones).
