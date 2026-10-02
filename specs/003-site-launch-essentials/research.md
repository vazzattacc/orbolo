# Phase 0 Research: Site Launch Essentials

`spec.md` left exactly one `NEEDS CLARIFICATION` marker (FR-SEO-008, canonical production host), resolved in §1 below from the brief rather than invented. Everything else in this document records implementation-approach decisions with rationale and rejected alternatives, per `/speckit-plan`'s research phase.

## 1. Canonical production host: `https://orbolo.com`

**Decision**: `astro.config.mjs`'s `site` is set to `https://orbolo.com`; every canonical URL, sitemap entry, and social-preview URL uses this host.

**Rationale**: `specs/_shared/references/orbolo-website-brief.md` §11 states plainly: *"Domains: orbolo.com primary; dataroom.orbolo.com → Papermark; verdant-by-orbolo.manus.space and ganaderiapasto.com redirect into the new site."* The brief is this project's authoritative source (per `002`'s own Content Sources precedent — the brief outranks the live site's current behavior). That the live site today also answers at `www.orbolo.com` is a DNS/redirect-configuration fact about the *old* site, not a statement of the *new* site's canonical identity, and 301-redirect setup is itself out of this feature's scope (spec.md Assumptions).

**Alternative considered**: `https://www.orbolo.com` (what the live site currently serves). Rejected — would canonicalize the new site to the old site's incidental serving behavior instead of the brief's explicit primary-domain statement, and would need un-doing the moment DNS/redirects are configured per the brief.

## 2. `@astrojs/sitemap`: new dependency, justified

**Decision**: Add `@astrojs/sitemap` (Astro's own first-party integration), configured with a `filter` that excludes `/404`.

**Rationale**: `FR-SEO-008` requires `/sitemap.xml` to list every shipped public page with absolute URLs and exclude the not-found page, updating automatically as pages ship (Privacy/Terms are conditional — see §5). Hand-maintaining a static `sitemap.xml` would silently drift the moment Privacy or Terms ships or unships (FR-LEG-004/007 make shipping conditional, not a one-time event) — exactly the kind of staleness a generated sitemap exists to prevent. `@astrojs/sitemap` is first-party, already compatible with this project's pinned Astro 7.x, and needs only `site` in config plus a filter function — no new content model, no new build step beyond what `astro build` already runs.

**Alternative considered**: A hand-written static `public/sitemap.xml`. Rejected — would need manual updates exactly when Privacy/Terms ship (an event this spec explicitly gates on external approval, FR-LEG-007), a maintenance burden the generated approach removes entirely.

## 3. `robots.txt`: no dependency, a static file

**Decision**: `public/robots.txt` is a plain static file:

```text
User-agent: *
Allow: /

Sitemap: https://orbolo.com/sitemap.xml
```

**Rationale**: `FR-SEO-007` is two unconditional lines with no page-dependent content — a generator package would be pure overhead. Astro copies `public/` verbatim to the build output, so this needs no integration at all.

## 4. Favicon/OG-image generation: `sharp` (already present), not a new dependency

**Decision**: The favicon raster set (`favicon.ico`, `apple-touch-icon.png` 180×180, `icon-192.png`, `icon-512.png`) and the shared social-preview image (`og-default.png`, 1200×630) are generated **once**, during implementation, from the existing `public/favicon.svg` and `public/images/branding/orbolo-logo.png`, and committed as static files — not regenerated on every build.

**Rationale**: `sharp` is already installed transitively (`node_modules/.pnpm/sharp@0.35.4...`, a dependency of Astro's default `astro:assets` image service) — using it for a one-off generation script adds no new `package.json` entry (Constitution Principle V: nothing to justify, since nothing new is added). These assets don't change per build (the mark itself is frozen — `FR-SEO-006`: "unchanged in shape and color"), so generating them at implementation time and committing the output is simpler and faster than wiring a build-time pipeline for assets that are effectively static brand collateral, matching how `favicon.svg` itself is already a committed static file, not build-generated.

**Alternative considered**: An Astro `astro:assets`/`<Image>` pipeline that regenerates these on every build. Rejected — unnecessary build-time cost for assets with zero per-build variability; also `.ico` (multi-resolution) isn't `astro:assets`'s native output format, so a one-off script (Pillow, already available in this environment) is simpler than forcing the build pipeline to produce it.

## 5. Footer link gating: driven by `LegalDocument.approved`, not a separate flag

**Decision**: `FooterLink.rendered` isn't a stored field — it's computed at render time as `getLegalDocument(kind) !== undefined`. `getLegalDocument()` returns `undefined` whenever the document doesn't exist (FR-LEG-004: source not found) **or** exists but isn't yet `approved` (FR-LEG-007), collapsing both "not shipped" cases into one check `Footer.astro` already has to make.

**Rationale**: Mirrors the `Metric`/`getMetric()` "omit if not ready" pattern `002` already established — one function, one meaning of `undefined`, no second boolean that could drift out of sync with the first. A footer link and its target page share exactly the same shippability condition (FR-LEG-001: "A link MUST be rendered only if its destination page ships"), so deriving one from the other is both simpler and impossible to get out of sync.

**Alternative considered**: A separate `rendered` boolean on `FooterLink`, set independently. Rejected — two flags for one underlying fact invites exactly the kind of drift (link shown, page not approved, or vice versa) this spec's own FR-LEG-001/004/007 chain is designed to prevent.

## 6. 404 handling on Firebase Hosting: Astro's own convention is sufficient

**Decision**: `src/pages/404.astro`, Astro's standard not-found convention — no `firebase.json` changes.

**Rationale**: Firebase Hosting automatically serves a `404.html` present at the root of the deployed public directory for any unmatched route, with a real 404 status — no rewrite rule needed. Astro's static build already emits `dist/404.html` from `src/pages/404.astro` by convention. This repository has no `firebase.json` yet (hosting/deployment setup is a separate, not-yet-ratified concern per the constitution's own "not yet ratified" language on hosting specifics) — creating one is out of this feature's scope; the page itself works correctly the moment a `firebase.json` exists and points its `public` directory at `dist`.

**Alternative considered**: Adding a `firebase.json` with an explicit 404 rewrite as part of this feature. Rejected — no `firebase.json` exists on this branch at all; introducing the project's first deployment-config file is a separate concern from building the 404 *page*, and doing so silently would be a scope addition beyond the 19 supplied keys.

## 7. Plausible analytics: script-level domain matching satisfies FR-AN-003, no custom gating logic

**Decision**: A single `<script defer data-domain="orbolo.com" src="https://plausible.io/js/script.js">` tag in `Layout.astro`'s `<head>`, present unconditionally in the HTML — no environment-conditional rendering logic in the template.

**Rationale**: Plausible's collector only records a page view when the `Host` the request actually came from matches the `data-domain` registered for the site in the Plausible dashboard (documented Plausible behavior, not an assumption) — a page view is recorded against `orbolo.com` only when `orbolo.com` is truly where the browser is. Loading the same static HTML on `localhost`, a Firebase preview-channel URL, or any host other than `orbolo.com` produces a request Plausible's backend itself ignores, satisfying FR-AN-003 ("local builds and preview channels MUST NOT send data to the production dashboard") without the SSG build needing to know, at build time, which host will eventually serve a given static file — a distinction a purely static site genuinely cannot make for itself at build time, since the same HTML file is byte-identical regardless of which host later serves it.

**Alternative considered**: A client-side `if (location.hostname === "orbolo.com")` guard before loading the script. Rejected — redundant with what Plausible's own backend already enforces, and adds a small custom-script-execution-order concern (FR-AN-004: analytics must not block or affect rendering) for no behavioral gain over the built-in mechanism.

## 8. `PageMeta`: a new, decoupled collection — not a retrofit of existing page content files

**Decision**: `src/content/pageMeta/pageMeta.json`, one entry per public route (`{id, route, description, indexable}`), read through `getPageMeta(route)`. Existing pages' `invest.json`/`beef.json`/`land.json` (from `002`) are **not** touched — their schemas gain no new fields.

**Rationale**: `FR-SEO-002` requires a meta description "drawn only from that page's already-approved content" but doesn't require it to live inside that page's own content object — keeping it in a separate, 003-owned collection means this feature's schema additions can't accidentally touch `002`'s already-shipped, already-tested content shape (Constitution Principle VI: structural changes to `002`'s declared content model would be a refactor of `002`, not an addition from `003`). `canonicalUrl` (in spec.md's `PageMeta` entity) is **computed** at render time (`site` config + route), not stored, to avoid two sources of truth for the same derivable value.

**Alternative considered**: Adding `description`/`indexable` fields directly to each existing page's own content JSON. Rejected — couples a 003-owned concern to 002-owned schemas, and would touch 4 already-shipped, already-tested content files for a feature whose own governing rule is explicitly "as-is, don't touch what's shipped."

## 9. Existing page titles: asserted by test, not re-implemented

**Decision**: `FR-SEO-001` requires existing titles stay byte-identical. Rather than reading them through any new mechanism, `tests/e2e/seo-meta.spec.ts` asserts the literal current strings ("Orbolo", "Invest — Orbolo", etc.) — the same titles already hardcoded in each page's `<Layout title="...">` prop today, completely untouched by this feature.

**Rationale**: `PageMeta.title` in spec.md's Key Entities is explicitly annotated "existing pages: read-only, unchanged" — there's nothing for this feature to build for existing titles beyond a regression test proving they didn't move.

## 10. Social-preview image: composited once, not per-page

**Decision**: One shared 1200×630 image (`public/images/social/og-default.png`) — the Orbolo wordmark centered on a solid `#f8f4e9` field (or `#516b3e`/`#bfd55d` accent block per the design pass — decided at implementation/`taste`-review time, not fixed here) — used as every page's `og:image`. Per spec.md FR-SEO-004: "Per-page preview images are out of scope."

**Rationale**: Matches the explicit requirement exactly; avoids a whole per-page-image content-modeling question (source photography, alt text per page, aspect-ratio cropping) this spec deliberately excluded.

## 11. `@astrojs/sitemap` dropped mid-implementation — a custom endpoint instead

**Decision (revises §2 above)**: `@astrojs/sitemap` was added, tried, and removed. `/sitemap.xml` is instead a small custom Astro endpoint, `src/pages/sitemap.xml.ts`, built directly from the `pageMeta` collection's `indexable` entries plus a conditional check against `getLegalDocument()` for Privacy/Terms.

**Rationale**: `@astrojs/sitemap`'s actual build output is `/sitemap-index.xml` (chunked-sitemap convention), not the literal `/sitemap.xml` path `FR-SEO-008`/`SC-005` name — discovered only by inspecting the real build output, not from the package's docs summary. A hand-written endpoint (justified: this site has 5–7 known routes, nowhere near sitemap chunking thresholds) gets the exact path **and** lets the same `getLegalDocument()` gating logic `Footer.astro` already uses decide Privacy/Terms inclusion directly — removing the open verification note §2/`contracts/footer-and-legal-gating.md` originally flagged ("confirm Astro doesn't still emit a route for an unapproved legal page") by construction, since the sitemap endpoint never relies on Astro's static-route discovery at all. `@astrojs/sitemap` is removed from `package.json` — Constitution Principle V's dependency ledger for this feature is now empty (no new runtime dependency; `sharp` remains transitively present only, per §4).

## 12. Legal content sourcing (FR-LEG-003) — fetched 2026-10-02

**Method**: Direct page fetch (this session's web-fetch tool) against `https://www.orbolo.com/`, first to discover the footer's legal links, then against each legal URL directly. No Playwright browser session was needed this time (unlike `002`'s earlier sandboxed-network block) — the web-fetch path reached `orbolo.com` successfully.

| Document | Source URL | Fetched | Source's own "last updated" |
|---|---|---|---|
| Privacy | `https://www.orbolo.com/privacy-policy` | 2026-10-02 | None stated — page shows no date at all |
| Terms | `https://www.orbolo.com/terms-conditions` | 2026-10-02 | None stated — page shows no date at all |

Both fetched successfully and transcribed into `src/content/legal/legal.json`, structured by heading/paragraph per `data-model.md`. **Both are `approved: false`** — neither ships yet (`FR-LEG-007`). The `FR-LEG-005` review list recorded on each entry is substantive, not cosmetic: the fetched Terms document names **"Orbolo GmbH", a company registered in Austria**, as the direct investment counterparty, governed by Austrian capital-markets law — the structural opposite of this site's entire investor-funnel premise (the Paraguayan operating company is always the contracting party, never Orbolo itself — `002` FR-GEN-004). This is flagged for Vaz/counsel as a legal-structure conflict, not a wording pass. Both documents also use multiple `§B2.6` banned words verbatim (not rewritten, per `FR-LEG-005`) and describe the pre-repositioning "ecosystem regeneration"/Austria framing the brief retires. Neither page states a "last updated" date, so `FR-LEG-006`'s fallback applies: the fetch date, labeled "Fetched," once (if) either document is approved and ships.

## 13. T054's baseline capture — resolved via git diff, not a runtime snapshot

**Problem**: `tasks.md`'s T054 called for capturing a pre-footer DOM/text baseline (Home/Invest/Beef/Land/Contact, 390px/1440px) *before* T043 added `<Footer>` to `Layout.astro`, for `as-is-freeze.spec.ts` (T055) to diff against. By the time this was reached, T043 had already landed — there was no running pre-footer build left to snapshot.

**Decision**: Used `git diff HEAD -- <path>` (HEAD = `78f8964`, the last commit before any of 003's — entirely uncommitted — work) as the baseline evidence instead. Checked specifically:

```
git diff --stat HEAD -- src/pages/index.astro src/pages/invest.astro src/pages/beef.astro src/pages/land.astro src/pages/contact.astro
```

returned **empty** — zero changes to the five existing page files themselves. The only pre-existing files this feature touched are `Layout.astro` (Footer + SEO/meta/Plausible — all in-scope), `Nav.astro` (trailing-slash `aria-current` bug fix), `global.css` (the approved `#bfd55d` token), and `settings.json`/`schema.ts`/`settings-repository.ts` (additive fields not consumed by these five pages' own rendering). This is stronger evidence than a DOM snapshot diff would have been — it proves byte-level non-modification of the page templates, not just an absence of *observed* rendering differences.

**Follow-up**: `as-is-freeze.spec.ts` (T055) was then written as a forward-looking regression guard instead of a before/after diff — it pins literal title/`<h1>` text for all five pages and asserts the footer renders exactly once, as the last element in `<body>` (excluding Astro's dev-only toolbar element), at 390px and 1440px. This keeps protecting the As-Is Freeze after this work is committed, when a `git diff HEAD` comparison would no longer mean anything.

**Alternative considered**: Reverting `Layout.astro` temporarily to re-capture a "real" pre-footer snapshot, then reapplying. Rejected as unnecessary churn — the git-diff evidence above already proves the same fact more precisely, and literal-text pinning gives better long-term regression coverage than a one-time snapshot comparison would have.

## 14. T056 — where `#bfd55d` actually landed

**Decision**: The accent was applied only at interaction moments, never to any element's resting/idle appearance, and never as a text color:

- Primary filled CTA buttons (`beef/Ctas.astro`, `invest/Closing.astro`, `invest/Hero.astro`, `land/WorkWithUs.astro`, `notfound/Hero.astro`): `hover:opacity-90` → `hover:bg-orbolo-accent`. Resting state is unchanged (still `bg-orbolo-green`); text stays `text-orbolo-cream` at all times — the accent never becomes a text color, only a hover-triggered background fill.
- `home/PathCard.astro`'s back face (revealed only once a card is flipped — itself an interaction): border recolored from `border-orbolo-green` (invisible against its own `bg-orbolo-green` fill) to `border-orbolo-accent` (2px), which actually reads as 3.66:1 against the green fill — a real, visible decorative frame instead of a no-op border.
- `Footer.astro`'s Privacy/Terms links: `hover:decoration-orbolo-green` → `hover:decoration-orbolo-accent` (the underline stroke color on hover only).

**Explicitly rejected**: Recoloring any `focus-visible:ring-*` to the accent. A keyboard focus indicator is a functional accessibility affordance, not a decorative fill — Vaz's WCAG waiver (2026-09-30) covers the accent as a knowingly-non-compliant *decorative* choice, not a regression to an *already-working* focus indicator. Accent-on-cream measures 1.48:1 (fails the 3:1 non-text/UI-component minimum outright); all focus rings stay `ring-orbolo-green`, which already passes. Also rejected: recoloring static/resting borders (card dividers in `PartnerRanches.astro`, `DeploymentPipeline.astro`, `Faq.astro`) — these aren't part of an interaction, so touching them would contradict the constitution's own taste directive ("reserve contrast for the interaction, not the resting page") for no functional gain.

## 15. Scroll-revealed photography on Invest and Land (2026-10-02, post-launch-checklist request)

**Decision**: After `/speckit-implement` closed out, Vaz asked directly for Invest and Land to "feel less HTML-based" with background photography visible on scroll. This runs against the recorded `orbolo-localhost.md` taste directive ("keep photography out of the hero — it belongs at the choice point") — but Home's existing hero already carries a background photo (`public/images/home/hero-background.jpg`, pre-dating this feature), so the site's own precedent already departs from that captured rule. Treated as a direct, explicit instruction from the site owner that supersedes the reverse-engineered guideline for these two pages, not silently reconciled.

Four sections got a photographic treatment, each reusing the `.specify/references/` images Vaz supplied earlier in this feature:

| Section | Image source | Why this one |
|---|---|---|
| `invest/Hero.astro` | `background.png` (cattle grazing) — recropped to the lower 45% where the herd actually is, since the original frame is ~60% empty sky | Literal subject of the page (owning cattle) |
| `invest/Closing.astro` | `nature.png` (hills/lake), recropped to the lake band | Final CTA — a "choice point" |
| `land/ElTapir.astro` | `field.png` (pasture + farmhouse) | El Tapir is literally a farm |
| `land/WorkWithUs.astro` | `green_ranch_2.png` (aerial farm/barn) | Landowner CTA — the clearest "choice point" on this page |

Implementation: a new reusable `.scroll-bg` class in `global.css` (not four one-off blocks) — each section sets `--scroll-bg-image` inline, with a flat `color-mix(cream 58%, transparent)` wash between the photo and the content so text keeps the same green-on-cream contrast ratio it has everywhere else, rather than sitting raw on a photo the way Home's hero text does. 58% (not Home's bottom-only gradient) was chosen after an in-browser check at 72%: the cattle photo in particular washed out to near-invisible since its usable subject sits in a narrow band low in the frame — 58% keeps every photo clearly legible as a photo while the overlay still does its job. `OfferBox`/`GanaderiaAPasto`/`PartnerRanches`/FAQ and other mid-page sections were deliberately left plain cream — not every section gets a photo; alternating is what keeps this from becoming a 3rd/4th resting-page contrast source the taste directive otherwise warns against.

**Verification**: Checked visually via Playwright MCP screenshots at 1440px and 390px for both pages (cattle/field/farm all clearly visible, text legible, no overflow). `pnpm run verify` re-run clean afterward (213/214 e2e tests passing; the one failure is the pre-existing `path-card-config-driven.spec.ts` HMR-timing flake on Home, unrelated — confirmed via `git diff` showing zero changes to that test, its fixture, or any Home/PathCard file).

**Not done**: No images were added to Contact or Home beyond what already existed.

## 16. Round 2 — Invest's middle stretch, and Beef (2026-10-02, same-day follow-up)

Vaz's follow-up: Land "is perfect," but Invest and Beef still read as "blogish" — specifically, the long plain-text run between Invest's two existing photo sections (Hero and Closing span 9 sections with nothing but text), and Beef having no photography at all yet.

**Invest**: added a third `.scroll-bg` section at `WhatYouOwn.astro` (~70% down the page, the most literal "choice point" — what the investor actually owns), reusing `background.png` but a different crop than the Hero (a wide establishing shot of the full grazing herd, vs. the Hero's tight crop on the nearest animals) so the two don't look like a duplicate. First attempt at this crop (the same 0.55-height band used for the Hero recrop) still read as too faint/hazy at this section's shorter `py-20` height — tightened to the 0.62-height band, which keeps the herd itself in frame instead of mostly empty horizon haze.

**Beef**: added `.scroll-bg` to three sections, using the three previously-unused `.specify/references/` photos so nothing is duplicated across pages:

| Section | Image | Crop note |
|---|---|---|
| `Hero.astro` | `cow.png` (portrait close-up, horns against sky) | used near-as-is; the portrait framing reads as a deliberate "peek" at hero height, not a cropping error |
| `FirstPick.astro` | `beef_meet.png` (raw cuts on linen) | square, minimal cropping needed — literal product shot for the section literally about picking cuts |
| `Ctas.astro` | `beef_related.png` (cow on a hillside) | needed a direct fractional crop (not a uniform cover-scale) — the source is near-square and the target is wide, so a cover-scale left no horizontal slack to recenter on the cow, which sat near the right edge; cropped a sub-rectangle (right ~58%, bottom ~45% of the original) before scaling so the cow is actually framed, not pushed to the edge |

Both pages re-verified the same way as round 1: Playwright MCP screenshots at 1440px and 390px (cattle/beef cuts/horns all clearly visible, no overflow), then `pnpm run verify` — clean, 216/216 e2e tests passing this run (the round-1 config-driven flake did not recur).
