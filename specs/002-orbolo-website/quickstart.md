# Quickstart: Validating the Orbolo Website

**Feature**: `002-orbolo-website`

## Prerequisites

- Node.js + pnpm.
- Repo scaffolded per `plan.md` Project Structure (created during `/speckit-implement`, not by this plan).
- Keystatic admin available locally (bundled into the Astro dev server per its standard integration).

## Setup

```bash
pnpm install
```

## Run

```bash
pnpm dev
# site: http://localhost:4321
# Keystatic admin: http://localhost:4321/keystatic
```

## Verification command (Constitution Principle II — closing condition)

```bash
pnpm run verify   # astro check && vitest run && playwright test && pnpm run lint:content && astro build
```

(`lint:content` runs the `assertContentCompliance` scan from `contracts/content-layer.md` across all published pages — the banned-word/"regenerative"/"guaranteed" gate, FR-032/SC-005.)

## Manual/E2E validation scenarios

Each maps to a `spec.md` user story; each should also exist as an automated Vitest/Playwright test per Constitution Principle II before that story is considered done (tracked in `tasks.md`).

1. **Home communicates the two engines (User Story 1, SC-002)**
   - Load `/`. Confirm hero, loop (4 linked stages), trust strip (partners each with a role), two audience cards (each with 3 dated numbers), "why this why now" (7 arguments each with adjacent proof), Code-in-five-lines, dated "where we are", "what we don't do yet", and the audience-split closing CTA all render in order.
   - Confirm "Invest in a herd" and "Buy beef" each navigate correctly, within one click from Home.

2. **Investor funnel through LOI (User Story 2, SC-003, SC-007)**
   - Load `/invest`. Confirm the offer box, deployment pipeline, risks, and FAQ render.
   - Confirm a ranch card's progress bar equals the sum of active (signed, unexpired) LOI head counts for that ranch, and that a ranch below 60% never shows "Released".
   - Submit "Get the investor pack" with only an email — confirm no NDA is required at this stage (light room).
   - (With a test fixture ranch reaching 60%) confirm its status becomes "Released" and the "no capital called before release" line is present.

3. **Buyer funnel (User Story 3, SC-004)**
   - Load `/beef`. Confirm the now/building/target staging is visually distinct and dated, the word "regenerative" does not appear describing current product, and the first-pick and conventional-price promises are both present.
   - Submit a spec-sheet request and a sample request independently of the investor flow.

4. **Landowner funnel (User Story 4)**
   - Load `/land`. Confirm El Tapir is named (not anonymised) with a dated expansion target, partner ranch cards are anonymised, and "Work with us" submits successfully.

5. **Trust layer reachable everywhere (User Story 5, SC-009)**
   - From at least three different pages (Home, Invest, Beef), confirm The Code, Glossary, and Contact are each reachable in one interaction.
   - On The Code, confirm every rule names a verifier.
   - Hover/tap a glossary term on its first occurrence on a page; confirm the tooltip shows definition, measured-by, and what-it-is-not.

6. **CMS-friendliness (User Story 6, SC-001)**
   - Add a new Partner, a new Metric (with `asOfDate`+`source`), and update a Ranch's LOI data purely through Keystatic. Confirm each change appears on the live site with zero page-template edits.
   - Add a Metric missing `asOfDate` or `source`; confirm it does NOT render (FR-031) rather than rendering a blank/broken value.

7. **Supporting pages (User Story 7)**
   - Load `/about`, `/orbolo-bridge`, `/contact` independently; confirm each renders its brief-specified content and Contact's forms route by audience.

8. **Multilingual mechanism (User Story 8, edge case)**
   - With a Spanish-language `Accept-Language` header, confirm redirect toward `/es/` where content exists, and that a page with only an English "published" version is not shown as if it were a finished Spanish page.
   - Confirm hreflang tags and the per-language sitemap are present.

9. **Content compliance gate (FR-032, SC-005)**
   - Run `pnpm run lint:content` against a fixture page containing a banned word; confirm it fails. Confirm it passes against real launch content.

10. **Redirects (FR-041, SC-010)**
    - Request a legacy `orbolo.com` URL and both legacy domains against the Firebase Hosting redirect config; confirm each 301s to the correct new page.

## Out of scope for this quickstart

Building/testing the actual Papermark, Make/Apps Script, Sheets CRM, Slack, or e-signature vendor integrations — those are external systems this feature links to and receives data from, not code this feature implements (see `spec.md` Non-goals and `research.md` §5).
