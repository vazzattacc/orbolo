# Quickstart: Validating Site Launch Essentials

**Feature**: `003-site-launch-essentials`

## Prerequisites

- Node.js + pnpm (existing project setup).
- Repo scaffolded per `plan.md` Project Structure (created during `/speckit-implement`).
- Privacy/Terms content requires network access to `https://www.orbolo.com/` at implementation time (`FR-LEG-003`) — if unreachable, US3 is partially blocked per `FR-LEG-004`, reported, not faked.

## Setup

```bash
pnpm install
```

## Run

```bash
pnpm dev
# site: http://localhost:4321
```

## Verification command (Constitution Principle II — closing condition)

```bash
pnpm run verify   # astro check && eslint . && vitest run && playwright test
```

## Manual/E2E validation scenarios

Each maps to a `spec.md` user story; each must also exist as an automated Vitest/Playwright test per Constitution Principle II before that story is considered done.

1. **Branded 404 (User Story 1, SC-004)**
   - Request `/this-does-not-exist`. Confirm HTTP status 404 (not 200), the existing top nav bar renders unchanged, a heading + one short sentence explain the page is missing, and a link returns to Home.
   - Confirm the response includes a `noindex` directive and `/this-does-not-exist`/`/404` does not appear in `/sitemap.xml`.

2. **SEO, social preview, favicons, crawlers (User Story 2, SC-002, SC-003, SC-005, SC-006)**
   - For each public page, read its `<title>`/meta description/canonical/OG tags; confirm every title and description is unique site-wide.
   - Confirm existing pages' titles are byte-identical to today's: "Orbolo", "Invest — Orbolo", "Beef — Orbolo", "Land — Orbolo", "Contact — Orbolo".
   - Fetch `/robots.txt`; confirm it allows all crawlers and references the sitemap.
   - Fetch `/sitemap.xml`; confirm it lists exactly the shipped public pages (5 today, 6–7 once Privacy/Terms ship) and excludes `/404`.
   - Request `/favicon.ico`, `/apple-touch-icon.png`, `/icon-192.png`, `/icon-512.png`, `/site.webmanifest`, and the OG image; confirm all return 200.
   - Paste a page URL into a social-preview debugger (or inspect the raw OG tags); confirm title/description/image resolve correctly.

3. **Privacy and Terms (User Story 3, SC-010)**
   - Load any page, scroll to the footer; confirm it shows exactly "Privacy" and "Terms" (only the ones whose `LegalDocument` is `approved`), keyboard-reachable, visible focus state.
   - Open Privacy (or Terms); confirm the rendered text traces to a recorded `sourceUrl` + `fetchedOn` in `research.md`, and a visible "last updated" line.
   - If a document wasn't found/approved: confirm its footer link doesn't render at all (no dead link), and confirm the gap + `FR-LEG-005` review list were reported, not silently filled in.

4. **Alt text and responsive QA (User Story 4, SC-007, SC-008)**
   - Run the automated alt-text sweep across every shipped page; confirm 0 images lack an alt attribute (content images meaningful, decorative images explicitly empty).
   - Run the automated responsive sweep on the 404/Privacy/Terms/Footer at 360px, 390px, 768px, 1024px, 1440px; confirm 0 horizontal scroll, comfortably tappable links.
   - Run the same sweep on the 4 pre-existing pages; confirm it's verification-only — any failure is reported as a separate finding, not silently fixed here.

5. **Analytics (User Story 5, SC-009)**
   - Inspect the page: confirm the Plausible script tag is present with `data-domain="orbolo.com"`, no cookies are set, no consent banner appears.
   - Block the analytics request (simulate an ad blocker); confirm the page still renders and the Home flip cards still work — zero visible/functional impact.
   - (Production-only, not locally testable) confirm a real production-domain visit appears in the Plausible dashboard within minutes.

6. **As-Is Freeze (SC-001, cross-cutting)**
   - Compare Home/Invest/Beef/Land/Contact before and after this feature, at 390px and 1440px: confirm zero structural/text differences above the new footer. Color-only changes from the `#bfd55d` accent are expected and excluded from this check (constitution, 2026-09-30) — see `contracts/footer-and-legal-gating.md`.

## Out of scope for this quickstart

CTA above the fold, sticky mobile CTA, loading states, form error states, thank-you page, cookie banner, real contact address (all explicitly "Out" in spec.md's Key Selection table); Lighthouse ≥ 90 targets; 301 redirects from old URLs/domains; hreflang/multi-language SEO; structured data (schema.org); any change to Contact beyond its document metadata and sitemap entry; actual Firebase Hosting / deployment configuration (no `firebase.json` exists yet on this branch — see `research.md` §6).
