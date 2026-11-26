# Research: Unified Site Restructure (006)

**Date**: 2026-11-25 · Inputs: `spec.md`, the copy deck, the code as it stands, the 005 contracts, Modern Web Guidance (MWG) guides, and small tests in a scratch folder outside the repo. No new dependency is proposed anywhere.

Each item: **Decision** · **Why** · **Alternatives**.

## R1. One content collection per page, plus shared lists

- **Decision**: page collections `home`, `capital`, `markets`, `opportunities`, `about`, `contact`, `media`, `notFound`; shared collections `site` (menu, footer, interface labels), `forms` (shared form copy and the four small forms), `choices` (Home cards), `faq`, `partners`, `team`, `projects`. Each has a Zod schema and one repository. JSON paths are the deck's content keys.
- **Why**: FR-GEN6-003, Constitution VIII, and the pattern the repo already uses. The shared lists exist because more than one place reads them: `partners` (Home, About), `projects` (cards, counter, About's Education link).
- **Alternatives**: one file per site (hard to review); keeping `ui.ts` (rejected by FR-GEN6-003 as amended).

## R2. Strings move out of `ui.ts`

- **Decision**: `src/i18n/ui.ts` is deleted once nothing imports it. `useI18n` keeps `locale` and `path`; the strings come from `getSite(locale)`. Privacy and Terms keep their hard-coded labels (known gap, not part of 006).
- **Why**: fix 5 moves menu, footer and Home hero; every other `ui.ts` string belongs to a section being removed, except the interface labels listed in `contracts/candidate-copy.md` and the two labels of the unused `MetricValue`.

## R3. Publishing a language per page

- **Decision**: `src/lib/site/published-locales.ts` answers "which locales exist for this route" by checking for the `<id>-es` entry **and** its `pageMeta` entry. `getStaticPaths`, the language switch, `hreflang` and the sitemap all use it. `LOCALIZED_ROUTES` goes away.
- **Why**: FR-GEN6-006, FR-NAV6-002. One source, so the four consumers cannot disagree.
- **Now**: no `-es` entries exist, so only English is built and no "ES" link shows.

## R4. Redirects (tested)

- **Decision**: one list in `src/lib/site/redirects.ts`, used by Astro's `redirects` option. The host's 301/302 rules are written from the same list when the site is deployed.
- **Tested 2026-11-25** (scratch project, this Astro version, `astro build`): a static build turns each redirect into an HTML page with `meta refresh`, `noindex` and a canonical link. It does **not** answer 301. An explicit `/es` entry works beside a `[...lang]` route.
- **Consequence**: FR-GEN6-002 and SC-002 say 301. Until a host is configured, visitors on a static preview are still forwarded, but by the page, not by a 301. Not tested: the status code in `astro dev`.
- **Alternatives**: adding `firebase.json` now (the repo has no hosting config and hosting is "later").

## R5. What "does nothing yet" means technically (tested)

- **Decision**: while the gate is closed, a form is rendered with `method="dialog"` and no `action`. With JavaScript, the script validates and then stops.
- **Tested** (Chromium, JavaScript off): pressing Send made 0 requests, the URL did not change, typed values stayed, and the browser's own required checks still ran. Firefox and WebKit were not installed, so they are untested; the HTML standard defines this behaviour (a `dialog` submission without an ancestor `<dialog>` returns).
- **Why**: FR-GATE6-001. A form with no method would put names and emails in the URL; a `post` to our own page would send them to the host.
- **Alternatives**: disabled button (not asked for); `onsubmit` (needs JavaScript).

## R6. The gate

- **Decision**: `resolveContactGate` becomes `resolveFormGate` and returns `{ sends: false } | { sends: true, endpoint, contactEmail }`. Forms always render. `settings.contactFormPrivacyApproved` keeps its name and stays `false`; nothing in 006 changes it.
- **Local dev**: today `.env.development` opens the form in `astro dev` against a fake `.test` host, so pressing Send locally would show an error. 006 moves those two variables into `scripts/ensure-dev-server.mjs`, so that `pnpm run dev` behaves like the live site (does nothing) and only the test run opens the gate. If a dev server without them is already running on 4321, the script stops it and starts its own, and says so.

## R7. Panels

- **Decision**: native `<dialog>` + `showModal()` from script, one per form (call, gathering) and one shared "I'm in" dialog whose project is set by its button. Openers: call = `<a href="/contact…">`; others = `<button>`. The script focuses the opener just before `showModal()`, so the browser returns focus to it on close (Safari does not focus links or buttons on click). `autofocus` on Name. No `role`, `aria-modal`, focus trap or Esc handler. Close button: `<form method="dialog">`.
- **Scroll**: `dialog:modal` and `::backdrop` with `overscroll-behavior: contain` (backdrop also `overflow: hidden`), `data-lenis-prevent` on the dialog, Lenis stopped on open and started on close. `global.css` has `.lenis.lenis-stopped { overflow: clip }`, which would remove the scrollbar and shift the page; it is overridden while a modal dialog is open.
- **Title**: the panel title is an `h2`. MWG allows an `h1`; the approved fixes did not include it, and FR-A11Y6-005 says one `h1`.
- **Page swaps**: `<ClientRouter />` swaps pages, so panels are wired on `astro:page-load` and released on `astro:before-swap`, like `motion.ts`.
- **Alternatives**: `command="show-modal"` (Baseline only since 2025-12-12 and cannot be put on a link; polyfill = new dependency).

## R8. "I'm in" and "Apply for a seat" without JavaScript

- **Decision**: the opening buttons are shown only when scripting runs; a `<noscript>` block in the same place holds the same form inline (per project; once for gatherings).
- **Why**: FR-OPP-005 asks for it, FR-GEN6-001 fixes the page list, and this needs no new page and no new copy.

## R9. One form engine

- **Decision**: `src/lib/forms/rules.ts` (pure: fields, limits, codes per form type), `src/scripts/forms.ts` (generalised from `contact-form.ts`, same behaviour), small field components in `src/components/forms/`. Wording arrives through a JSON island, as today.
- **Phone**: shown by CSS `form:has(...)` so it also works without JavaScript (tested, Chromium). The script toggles `required` and `disabled`. Without JavaScript the server checks it.
- **Checkbox groups**: "at least one" cannot be expressed in HTML; script and server check it.
- **After a successful send** (gate open): the form is replaced in place by its success text, focus moves there. No navigation, so no thanks page with JavaScript.

## R10. Time zones (tested)

- **Decision**: build-time `<select>` from `Intl.supportedValuesOf("timeZone")`, plus UTC, plus the detected zone if missing.
- **Tested** (Node 26): 418 zones, **no UTC**, and older names (`Asia/Calcutta`, not `Asia/Kolkata`), so both additions are needed. Weight: 13.5 KB of HTML, 2.9 KB gzipped, on each page that carries the panel.
- MWG's Temporal guide does not apply: no date is stored, only day and part-of-day codes.

## R11. FAQ, glossary, "More ideas"

- **Decision**: native `<details>` without `name` (they open independently); no headings inside `<summary>`; group names are `h3`. The existing `.faq` styles are reused.
- **Structured data**: FAQPage JSON-LD built from the same entries through `src/lib/faq/faq-jsonld.ts`. MWG has no structured-data guide. A unit test checks shape and text; no validator dependency.

## R12. Partner band

- **Decision**: list of names/logos once, plus `aria-hidden` copies for the loop. Animation only inside `@media (prefers-reduced-motion: no-preference)` and only while the script has added its button. One button, label switches Pause/Play, no `aria-pressed`. Pauses on hover and focus. The old strip's keyframes are reused. The MWG carousel guide does not apply (continuous band, not slides).

## R13. Photos

- **Decision**: JSON names a photo (`photo: { name, alt, focus?, focusNarrow? }`); `name` is validated against the photo library, and `Photo.astro` draws it. Kept photos used by 006 get a **byte-identical copy** in `src/assets/photos/`, so every slot gets AVIF/WebP/JPEG and sizes (FR-IMG6-002). Files in `public/images/` are untouched (FR-IMG6-005); a unit test compares the hashes.
- **Why**: Astro only processes files under `src/`; 005 left kept photos as plain images, which cannot satisfy "every slot".
- **Adds** two `kind`s to `Photo.astro`: `card` and `figure`. No second hero priority.

### Photo per slot – **approved by Vaz 2026-11-25**

| Page | Slot | Photo | Note |
|---|---|---|---|
| Home | hero | `pasture-herd` (06) | decided |
| Home | story, 3 gaps | `shade-tree` · `nelore-herd` · `pasture-top` | |
| Home | cards | `investors` · `buyers` · `landowners` | FR-IMG6-004 |
| Home | come and see it | `orbolo-walk` · `orbolo-cattle-shade` | both from the `orbolo-*` set; approved beside the El Tapir text |
| Home | closing collage | `brahman-four` · `florian` · `cow-grazing` | |
| Capital | hero (herd under native trees) | `gaucho-nelore` | closest match; alternative `calves-sky` (today's Invest hero) |
| Capital | proof | `orbolo-gauchos` · `orbolo-herd` | |
| Capital | closing collage | `brahman-four` · `grazing-bright` · `cows-bells` | |
| Markets | hero (cattle on grass; boxed product) | `cow-grazing` | boxed product: none |
| Markets | five tiles | none | only Beef could have an honest photo; one photo among five looks broken |
| Markets | team | none | |
| Markets | closing collage | `orbolo-herd` · `grazing-bright` · `shade-tree` | |
| Opportunities | hero | `orbolo-palms` | deck names no photo; the hero shell needs one |
| Opportunities | five project cards | none | no bees, buffalo, school or Amazon photo exists; text cards until then |
| Opportunities | proof | `orbolo-cattle-shade` | 600 px wide: shown small |
| Opportunities | Villa Weiss | none | |
| About | hero (sunrise over the Chaco) | `shade-tree` | today's About hero; no sunrise photo is allowed |
| About | ch. 1 | `grazing-bright` | |
| About | ch. 2 | `florian` | |
| About | ch. 3 (forest edge, pasture) | `calves-sky` | |
| About | ch. 4 (team and cattle) | `orbolo-gauchos` | |
| About | closing collage | `nelore-herd` · `orbolo-walk` · `orbolo-cattle-shade` | |
| Contact | hero | `brahman-four` | as today |
| Media kit | hero | `pasture-top` | deck names no photo |
| 404 | hero | `orbolo-walk` | as today |

`orbolo-herd.jpg` and `buyers.jpg` are the same picture, as are `orbolo-gauchos`/`investors` and `orbolo-palms`/`landowners`; the mapping never puts both on one page.

## R14. Checking the copy against the deck

- **Decision**: `tests/unit/support/deck.ts` parses the deck `.md` into key → text (joins line breaks, removes notes such as `[TO COME…]`, `Button:`, `→ /route`). A unit test compares each key with the JSON, and has an explicit list of keys split into several fields and of the exception in FR-CON-002. An e2e test then checks that each JSON string is in the page's `textContent` (`textContent`, because CSS uppercases `innerText` and closed `<details>` have none), under reduced motion so SplitText does not touch headings.
- **Why**: FR-TEST6-003, SC-001. This is the "checked against the deck" step, made automatic.

## R15. Success criteria that automated tests can't fully prove

| Item | How it is checked |
|---|---|
| SC-002 (301) | unit test on the list; e2e that old routes end at the new page; real 301 only after a host exists |
| SC-003 (under 2 minutes) | keyboard-only e2e for completion; the time itself by hand |
| SC-008 (Lighthouse ≥ 90) | by hand in Chrome DevTools on the production build; CLS and image weight by e2e. No dependency added |
| SC-011 | Vaz, on the preview |

## R16. Still open when planning ended

| # | Point | What this plan assumes |
|---|---|---|
| P1 | **Resolved 2026-11-25** (Vaz: A): a static page can't read `/contact?interest=…` without JavaScript, so the interest is preselected with JavaScript only | Spec delta in US1 AS6, FR-CON-006/007 |
| P2 | Where no-JS visitors land after a small form (R8) once sending works | Decided before the gate opens; nothing built now |
| P3 | The count request needs `GET` allowed cross-origin; 005 FR-API-008 allows only `POST` | Written into `contracts/forms-endpoint.md` as a pending delta |
| P4 | **Resolved 2026-11-25** (Vaz: B): "© ‹year› Orbolo" and "Scroll" aren't in the deck | Copyright line kept, scroll cue dropped |
| P5 | **Resolved 2026-11-25** (Vaz: A): OQ-006-M2, fifth tile | No link |
| P6 | Order form (OQ-006-M3) | Not built; both "Request a quote" buttons absent |
