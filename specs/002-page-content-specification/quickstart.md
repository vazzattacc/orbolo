# Quickstart: Validating Invest, Beef & Land

**Feature**: `002-page-content-specification`

## Prerequisites

- Node.js + pnpm (existing project setup — no new tooling).
- Repo scaffolded per `plan.md` Project Structure (created during `/speckit-implement`).

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
pnpm run verify   # astro check && eslint . && pnpm run test:unit && pnpm run test:e2e
```

## Manual/E2E validation scenarios

Each maps to a `spec.md` user story; each must also exist as an automated Vitest/Playwright test per Constitution Principle II before that story is considered done (tracked in `tasks.md`).

1. **Investor funnel (User Story 1, SC-001, SC-006, SC-011)**
   - Load `/invest`. Confirm every `FR-INV-*` section that has real content renders, in order: hero, offer box, "Is this real?", "Who buys the animal at the end?", "What if not enough people join?", "What if it goes wrong?", "How it works," "What you own, precisely," "Who verifies what," FAQ, closing, cross-link to Beef.
   - Confirm the offer box states terms are available on request (no invented ticket/return/fee numbers) and shows no illustrative "[X] head" example.
   - Confirm the risks section states specifics live in the NDA-gated data room, not on the page.
   - Confirm the FAQ's eligibility answer directs the visitor to contact Orbolo, not a stated rule.
   - Confirm the Deployment Pipeline section does **not** render (no ranch data exists).
   - Confirm "Is this real?" shows El Tapir's 1,000 ha figure and the "500+ animals and growing" figure, each with a visible date and source on hover/adjacent text.
   - Confirm the closing footer line names "Orbolo" as the contracting entity.
   - Confirm exactly one cross-link to Beef ("See where your beef is sold").

2. **Buyer funnel (User Story 2, SC-001, SC-003)**
   - Load `/beef`. Confirm hero, "What we sell today," "The promise," "First pick," "Why supply from the group is different," "Who verifies what," CTAs, and the cross-link to Invest all render.
   - Confirm "regenerative" does not appear anywhere on the page.
   - Confirm no named customers appear anywhere.
   - Confirm the roadmap section does **not** render (no dated milestones exist).
   - Confirm exactly one cross-link to Invest ("Own the herd behind this beef").

3. **Landowner / Land exploration (User Story 3, SC-001)**
   - Load `/land`. Confirm El Tapir (with its 1,000 ha figure, dated/sourced), Ganadería a Pasto (35,000 ha, four-step methodology, dated/sourced), and "Work with us" all render as sections on the single page.
   - Confirm El Tapir's expansion-target line does **not** render (still unanswered).
   - Confirm Partner ranches does **not** render (no ranch data exists).

4. **Trust layer / nav reachability (SC-007)**
   - From each of Home, Invest, Beef, and Land, confirm the persistent top nav bar reaches all three other pages plus Contact, in one click.
   - Load `/contact` directly and confirm it renders (stub page, not a 404).

5. **Content compliance (SC-002, SC-003, SC-004)**
   - Scan all three pages' rendered text for the `§B2.6` banned-word list — zero hits outside a Glossary context (none exists in this feature's scope, so effectively zero hits anywhere).
   - Scan for "guaranteed" describing returns — zero hits.
   - Scan for every rendered number — confirm each has a visible date and source (El Tapir hectares, GAPP hectares, animal count are the only numbers in scope today).

6. **Hidden-section correctness (Edge Cases, `contracts/nav-and-hidden-sections.md`)**
   - Using a test fixture with `deploymentPipeline`/`partnerRanches`/`roadmap` populated, confirm those sections **do** render correctly — proving the hide/show logic is genuinely conditional, not permanently disabled code.

## Out of scope for this quickstart

Final, polished marketing copywriting (this spec defines structure and Vaz-confirmed facts, not voice-perfected prose); the Deployment Pipeline's live/dynamic LOI mechanics; Spanish/German content; the FAQ, Code, Glossary, About, or Orbolo Bridge pages themselves (link targets only); the investor portal or Papermark data room build-out — see `spec.md` Non-goals.
