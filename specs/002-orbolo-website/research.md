# Phase 0 Research: Orbolo Website — Full Site

**Feature**: `002-orbolo-website` | **Date**: 2026-09-16

The stack's outer boundaries (Astro, Firebase Hosting EU, a CMS, GitLab CI) are already fixed by the project constitution's 2026-09-16 amendment, sourced from `.specify/references/orbolo-website-brief.md` §11. This phase resolves the decisions the brief explicitly left open, plus the architecture needed to implement `spec.md`'s 41 functional requirements.

## 1. CMS product: Keystatic

- **Decision**: Keystatic as the content system, with content stored as structured files (Markdown+frontmatter / YAML, per collection) inside the same GitLab repo, edited through Keystatic's admin UI which commits directly to git.
- **Rationale**: The brief explicitly allows "Keystatic/Decap or FireCMS acceptable if preferred" alongside Sanity/Payload (§11). Keystatic wins on every axis that matters for this project specifically:
  - **EU data residency** (constitution requirement) is automatic — content lives in the same GitLab repo/region as the code, no third-party SaaS data-processor question to resolve.
  - **GitLab CI integration is free** — a content edit *is* a git commit, so "Publish → GitLab pipeline via webhook" (brief §11) is just the existing push-triggered pipeline; no separate CMS webhook needs building or securing.
  - **Reviewability** — content changes flow through merge requests like code, which fits this project's "spec before code / human review at every checkpoint" culture (constitution Principles I, III) better than a hosted CMS's own approval workflow.
  - **No extra runtime** — unlike Payload (needs a running Node server + database), Keystatic needs no backend of its own; the site stays a fully static Astro build, matching the brief's own framing ("a coded static site", §2).
  - **Built for Astro** — Keystatic is designed for exactly this pairing (Astro/Next.js static sites with `astro:content` collections), including per-locale field support and a "field-level translations, missing-translation view" pattern via per-locale collections (brief §11, §14).
- **Alternatives considered**:
  - *Sanity* — strong structured-content/relations story and real-time collaborative editing, but content lives in Sanity's own hosted cloud, adding an external data processor to reason about for EU residency, and its webhook-to-GitLab publish trigger is one more integration to build and secure versus Keystatic's "it's just git" model. Rejected for this project's ops-minimalism (Principle V).
  - *Payload* — full control, but requires hosting a Node server + database ourselves, which contradicts "a coded static site" and adds real infrastructure (and cost/ops surface) beyond what this feature's content needs justify. Rejected.
  - *FireCMS* — pairs naturally with Firebase/Firestore, but this feature deliberately has no Firestore dependency yet (reserved for the investor-portal phase, brief §11); adopting Firestore now to support FireCMS would be premature infrastructure. Rejected.
- **Content model mapping**: each Key Entity in `data-model.md` (Page, Section, Partner, Term, Rule, Metric, Ranch, Roadmap milestone, Team member, Blog post, Settings) becomes a Keystatic collection or singleton, consumed at build time through Astro Content Collections (Zod-validated schemas) — never read directly by page templates, mirroring the isolation-layer pattern already proven in `001-orbolo-path-selection`'s `PathRepository` (constitution Principle VIII).

## 2. E-signature vendor: Dropbox Sign

- **Decision**: Dropbox Sign for LOI and definitive-contract signing, linked from inside the full data room.
- **Rationale**: The brief states Papermark's documented Zapier/Make routing targets DocuSign, "the same works with Dropbox Sign" (§10) — implying Dropbox Sign integrates at least as directly. Dropbox Sign's API supports template-based signature requests (matching the brief's "LOI template, expiry policy, definitive contract template", §16) cleanly, and it is the lighter-weight of the two commercial options for a template-driven, webhook-notified flow.
- **Alternatives considered**: DocuSign (equally viable per the brief, more enterprise-oriented, heavier setup); Google Docs eSignature (fits "Google Workspace by default", §3, but is the newest of the three and least proven for this exact template+webhook pattern as of the brief's writing). Both remain valid swap-in alternatives — this feature's design keeps the signing step behind a single external link-out and a webhook-consuming boundary (§5 below), so switching vendors later touches configuration, not application architecture.

## 3. Astro rendering strategy: static output, minimal islands

- **Decision**: `output: 'static'` Astro build. Interactive elements (glossary tooltips, the loop diagram's one-time animation, ranch-card progress bars, form validation) are built as small, framework-free islands using native HTML (`<details>`/`popover` for tooltips, native form elements) plus vanilla TypeScript `<script>` blocks with Astro's `client:*` directives only where real client-side state is unavoidable.
- **Rationale**: The brief is explicit — "plain HTML, islands only where needed" (§11). None of this feature's interactivity requires client-side reactive state that outlives a single interaction (a tooltip open/closed, a one-time reveal animation, native form submission to Google Forms). Introducing a component-island framework (React/Vue/Svelte) would add a client-side runtime dependency with no corresponding requirement — a direct violation of Principle V (no new dependencies without justification) given native HTML/CSS/vanilla-JS covers every interaction in `spec.md`.
- **Alternatives considered**: A React or Svelte island set (as used in `001-orbolo-path-selection`'s Next.js build) — rejected here specifically because this feature's interactions are simpler (no client-side navigation transitions, no `useReducedMotion`-gated physics-based animation) and the brief's own "islands only where needed" instruction reads as a direct steer away from a default component-framework habit.

## 4. Ranch pipeline mechanics as a pure, tested function

- **Decision**: The 60%-release / status-sequencing / LOI-expiry rules (FR-009–FR-013) are implemented as a single pure function (`computeRanchStatus(ranch, loIs, now)`) consumed by both the ranch-card component and any future dashboard, unit-tested exhaustively (every status transition, the 90-day expiry boundary, the "never call capital before release" invariant).
- **Rationale**: This is the most behaviorally load-bearing, legally-sensitive logic in the whole spec (FR-009 through FR-013, FR-015, and Non-negotiables §17) — it must be independently testable and never duplicated between a card view and any other view.

## 5. Webhook-driven automation stays outside this feature's codebase

- **Decision**: The Papermark → CRM/Slack automation described in brief §10 ("Visitor verifies email → Papermark webhook → Make or Apps Script → new row in the Sheets CRM + Slack message", etc.) is configured in Papermark, Make/Apps Script, Google Sheets, and Slack directly — not built as application code in this repo. This feature's responsibility ends at providing correct link-outs (to Papermark rooms, to the e-signature flow) and, where the brief requires the website itself to reflect pipeline state (e.g. a ranch's LOI count), consuming data that arrives into the CMS/content layer through whatever sync mechanism operations sets up (out of this feature's scope — see `spec.md` Non-goals).
- **Rationale**: `spec.md` explicitly scopes "building the actual CRM/Sheets automation, Slack/Make/Apps Script integrations, or e-signature vendor integration code" as a non-goal — the spec defines the *behavior* those integrations must produce (FR-029, FR-036), not their implementation. Keeping this boundary firm prevents the feature from silently growing into building a full backend automation platform.

## 6. i18n routing

- **Decision**: Astro's built-in i18n routing (`/en/`, `/es/`, `/de/` with a configured default locale and `redirectToDefaultLocale`), hreflang tags generated per page from the same routing config, and a per-language sitemap via `@astrojs/sitemap`'s i18n support.
- **Rationale**: Matches brief §13 exactly (`/en/ /es/ /de/` with hreflang, root redirect by `Accept-Language`, manual switcher) using Astro's first-party i18n feature rather than a third-party routing library — no new dependency needed (Principle V).

## 7. Content-compliance lint as a CI gate

- **Decision**: A build-time/CI script scans every published page's rendered text against the banned-word list, "regenerative" (outside Glossary context), and "guaranteed" (for returns), failing the pipeline if any match is found outside its permitted context.
- **Rationale**: FR-032 and SC-005 are non-negotiable per the brief (§17); a manual proofread is not sufficient for an "always true" guarantee across every future content edit. This is the same philosophy as `001-orbolo-path-selection`'s `path-repository.ts` validation-at-load — encode the constraint in code, not just in a style guide.

## 8. Deployment & CI

- **Decision**: GitLab CI pipeline: merge request → Firebase Hosting preview channel deploy; `main` branch → Firebase Hosting production deploy. Firebase service account credentials stored as a masked/protected CI variable. Two Firebase Hosting targets (matching brief §11's "two hosting targets" — production and preview/staging).
- **Rationale**: Directly specified in brief §11; no alternative considered, this is a fixed constraint, not an open decision.

## 9. Root language redirect on a static site

- **Decision**: The root `/` route is a minimal static page whose only job is a client-side redirect: read `navigator.languages`, match against the site's available locales, `window.location.replace()` to the best match (default `en`), with a `<noscript>` meta-refresh to `/en/` as the no-JS fallback.
- **Rationale**: FR-038 wants the root to redirect by the visitor's actual language preference (not just always to `en`), but the site is static (brief §2) — there is no server per-request to read an `Accept-Language` header the way a dynamic site would. `navigator.language`/`navigator.languages` is the client-side equivalent of that same signal, so this satisfies the requirement's intent without adding a server, an edge function, or a third-party routing dependency (Principle V). Astro's own built-in `redirectToDefaultLocale` was turned off (`astro.config.mjs`) in favor of this, since it only ever targets one fixed locale.

## 10. Keystatic's admin UI is dev-only, not part of the production build

- **Decision**: `@keystatic/astro` is only added to the Astro `integrations[]` array when `process.env.NODE_ENV !== "production"`. The public production build stays `output: "static"` with no `/keystatic` route at all.
- **Rationale**: Discovered by actually running `astro build`, not by inspection — Keystatic's admin route needs a live server endpoint to save content (it calls `getStaticPaths` unconditionally and fails under static output with `[GetStaticPathsRequired]`). Astro's `output: "hybrid"` would fix that, but only by requiring a hosting adapter Firebase Hosting doesn't otherwise need (`[NoAdapterInstalled]`), which contradicts both the brief's "a coded static site" (§2) framing and Constitution Principle V's no-new-dependency bar. Content editors use `pnpm dev` locally (or a separate internal environment) for the Keystatic UI; the deployed public site never includes it.

## 11. `@astrojs/sitemap` pinned to 3.2.1, not the caret-resolved latest

- **Decision**: `@astrojs/sitemap` is pinned to the exact version `3.2.1` (not `^3.2.1`) in `package.json`.
- **Rationale**: `pnpm install` resolved the caret range to `3.7.4`, which calls an `astro:routes:resolved` integration hook that Astro 4.16.19 (this project's pinned Astro version) never fires — causing a silent `_routes` to stay `undefined` and crash `astro build` with `Cannot read properties of undefined (reading 'reduce')` inside the sitemap plugin's `astro:build:done` hook, with no indication the actual cause was a version mismatch (no peerDependency was declared to catch it). `3.2.1` uses only hooks Astro 4.16 supports. Verified by running a real production build (`pnpm build`) end to end and inspecting the generated `dist/sitemap-0.xml` (31 URLs across `en`/`es`/`de`), not merely by trusting `astro check`/dev-mode, which never exercises this integration at all.

## 12. Unquoted multi-word font names with a bare digit silently break the whole declaration

- **Finding**: `tailwind.config.mjs` originally declared `display: ["Fraunces", "Source Serif 4", "Georgia", "serif"]`. This looks like valid CSS and Tailwind compiles it verbatim into `font-family:Fraunces,Source Serif 4,Georgia,serif` — but "Source Serif 4"'s trailing bare `4` is not a valid CSS `<custom-ident>` token (identifiers can't be pure digits) when unquoted, which invalidates the entire comma-separated `font-family` value per CSS's list-value error handling. The browser's CSS parser silently drops the whole declaration — not just that one alternative — so `.font-display` compiled to an effectively empty rule and every heading site-wide rendered in the inherited body sans-serif the entire time this feature was built, despite the CSS "looking" correct in the raw served text.
- **Why this was hard to catch**: `astro check` (types), the e2e/unit test suite, and even reading the generated CSS file's raw text all looked fine — none of them parse CSS the way a browser's rendering engine does. It was only caught by inspecting the *live parsed CSSOM* (`document.styleSheets[n].cssRules[n].cssText`) in an actual browser and finding an empty rule where a populated one was expected, during the mandatory `taste` pass (Constitution Principle X) — a concrete case for why that pass exists as a real verification step, not a formality.
- **Fix**: quote any multi-word font-family alternative that contains a bare number or otherwise isn't a clean sequence of alphabetic identifier tokens — `'"Source Serif 4"'` instead of `"Source Serif 4"` in the array. Also added the missing Google Fonts `<link>` tags to `BaseLayout.astro` (the fonts were declared in Tailwind's theme but never actually loaded at all, a separate omission caught in the same pass).

## Outcome

All plan-level decisions the brief deliberately left open (CMS product, e-signature vendor, rendering strategy for "islands only where needed") are now resolved with rationale. No `NEEDS CLARIFICATION` markers remain. Proceeding to Phase 1.
