# Phase 0 Research: Contact Form and Background-Photo Refresh

**Two parts.** Part A (§1–§16, 2026-11-11) covers the contact form and is unchanged. Part B (§17–§27, 2026-11-14) covers the background-photo refresh added by the spec's 2026-11-14 amendment (FR-IMG-*). Part B starts after §16.

# Part A: Contact form (2026-11-11)

`spec.md` has no `NEEDS CLARIFICATION` markers. Its seven open questions (OQ-C1…C7) block **publishing** the form (FR-GATE-001) or belong to the backend spec. None blocks **building** it. This document records the implementation decisions, with the rationale and rejected alternatives for each. Two of them need Vaz's confirmation before `/speckit-tasks`: §12, a new dev dependency, and §13, a proposed spec delta. Both are listed in `plan.md` → "Decisions awaiting approval".

Facts measured in the repo on 2026-11-11 and relied on below:
- `pnpm build` takes about 3 s (15 pages).
- `legal.json` has `privacy.approved = false`.
- `motion.ts` hijacks every `a[href^="#"]` click into a 1.4 s Lenis scroll, without moving focus.
- `Layout.astro` mounts `<ClientRouter />` and the Plausible script on every page.
- `Btn.astro` renders only `<a>`.

## 1. Endpoint URL: an `astro:env` build-time variable

**Decision**: Declare `PUBLIC_CONTACT_ENDPOINT` in `astro.config.mjs` → `env.schema` as `envField.string({ context: "client", access: "public", optional: true, url: true })`. Read it in the Contact page frontmatter through `astro:env/client`. Unset means the gate is closed (§2).

**Rationale**: FR-GATE-002 wants changing servers to be a configuration change, not a code change. `astro:env` is built into Astro 7, so it adds no dependency. It validates the value as a URL at build time, so a typo fails the build loudly instead of shipping a form that posts nowhere. The value is inlined at build, so the site stays static (Governing Rule 3).

**Alternatives considered**:
- Raw `import.meta.env` without a schema: rejected, because it gives no validation and no typed access.
- A field in content JSON: rejected, because the endpoint differs per environment (dev mock, preview, production), and content JSON is one value for all of them.

## 2. Publishing gate: one pure function, four conditions

**Decision**: `src/lib/contact/gate.ts` exports a pure `resolveContactGate(input)`. In a production build the gate is **live** only when all four of these hold:

1. `PUBLIC_CONTACT_ENDPOINT` is set (FR-GATE-001a).
2. `settings.contactFormPrivacyApproved === true`: Vaz/counsel approved the form's privacy wording (FR-GATE-001b, FR-LEG5-002).
3. The Privacy page is published (`getLegalDocument("privacy")` resolves), because the form's privacy line links to it (FR-LEG5-001).
4. `settings.contactEmail` is set, because every failure state needs it (FR-UX-012; OQ-C1 "Blocks FR-GATE-001").

The Contact page, both result pages and the sitemap all call the same function (through `getContactFormGate()` in the repository), so they can't disagree.

**Rationale**: Conditions 3 and 4 aren't spelled out in FR-GATE-001, but the spec makes both prerequisites:
- OQ-C1 says the inbox address blocks FR-GATE-001.
- FR-LEG5-001/002 require a reachable Privacy page that describes the processing.

Shipping a form whose privacy link 404s, or whose failure state has no address, would break Governing Rule 4 ("no half-working form"). Today condition 3 is false (Privacy isn't approved), so production keeps the stub. That is the intended fail-closed state.

**Alternative considered**: Gate only on the endpoint plus one flag, as FR-GATE-001 literally lists. Rejected for the reasons above.

## 3. Seeing and testing the live form before approval: dev-only preview mode

**Decision**: Commit a `.env.development` file, which Vite loads only for `astro dev`, never for `astro build`:

```text
PUBLIC_CONTACT_ENDPOINT=https://contact-endpoint.orbolo.test/contact
CONTACT_FORM_PREVIEW=true
```

`CONTACT_FORM_PREVIEW` is declared as `envField.boolean({ context: "server", access: "public", default: false })`. The gate honours it **only when `import.meta.env.DEV` is true**. In preview, conditions 2–4 of §2 are waived, and the fallback address is `settings.contactEmail ?? "contact@example.com"` (RFC 2606 reserved, so it can't reach anyone). A visible preview flag (the existing `.flag` style, copy in JSON) says the form isn't live in production yet. `.test` is a reserved TLD (RFC 6761), so the dev endpoint can never resolve. Every e2e test intercepts it with `page.route`.

**Rationale**: The e2e suite runs against `astro dev`. The live-form tests are the bulk of FR-TEST-002 and need the gate open, but the real approvals don't exist yet. The two other ways to open the gate are worse:
- Setting `contactFormPrivacyApproved: true` in committed content would be a false legal record.
- Mutating the fixture per test (the `hidden-sections-mutation` pattern) relies on Astro's content watcher reloading the page mid-test. That has proven intermittently flaky in this repo: `path-card-config-driven` failed on 2026-10-10 and 2026-10-28 for exactly that reason.

The preview flag can't leak into production because the check needs `import.meta.env.DEV`, which is false in every `astro build`.

**Alternative considered**: A separate `astro dev --mode test`. Rejected, because it adds a second dev server for no gain over the dev-only flag.

## 4. Testing the closed gate against a real production build

**Decision**: Add a Playwright project, `production-gate`, with `baseURL` `http://localhost:4322`. A new `scripts/ensure-production-preview.mjs` (run from `pretest:e2e`, after `ensure-dev-server.mjs`) does two things:
1. Runs `astro build` with `PUBLIC_CONTACT_ENDPOINT` and `CONTACT_FORM_PREVIEW` explicitly removed from the child environment.
2. Starts `astro preview --port 4322`, polling until it answers, the same way `ensure-dev-server.mjs` does.

The project's spec asserts:
- `/contact` and `/es/contact` show today's stub text;
- `/contact/thanks`, `/contact/error` and their `/es` twins return 404;
- `/sitemap.xml` lists none of them;
- no `<form>` exists on the page.

**Rationale**: SC-007 is literally about the production build ("the production build succeeds and Contact shows exactly today's stub"). Testing the real build output is the only faithful check, and the build takes about 3 s. Unit tests of `resolveContactGate` cover every combination of the four conditions. This project proves the wiring.

**Alternative considered**: Unit-testing the gate only. Rejected: the unit tests can't catch a page that forgets to call the gate, or a `getStaticPaths` that still builds the result pages.

## 5. Static pages and gated result pages

**Decision**:
- `src/pages/[...lang]/contact.astro` renders the stub or the form, based on the gate.
- New `src/pages/[...lang]/contact/thanks.astro` and `contact/error.astro`. Their `getStaticPaths` return `localeStaticPaths()` when the gate is live and `[]` when it's closed. An empty `getStaticPaths` builds nothing, so the pages 404 and can't be linked by accident.
- Four new `pageMeta` entries (`contactThanks`, `contactThanksEs`, `contactError`, `contactErrorEs`) with `indexable: false`. `Layout.astro` already turns that into `<meta name="robots" content="noindex">`, and `sitemap.xml.ts` already lists only indexable entries (FR-PAGE-001/002/003).
- `/contact/thanks` and `/contact/error` are added to `LOCALIZED_ROUTES`, so the language switch on a result page goes to its twin rather than to the other language's Home. Layout emits hreflang alternates only for indexable pages, so nothing changes in the head.

**Rationale**: This reuses the existing metadata and sitemap mechanisms unchanged. No adapter and no on-demand rendering are needed (Governing Rule 3).

## 6. Content: a new `contact` collection plus two shared settings

**Decision**:
- **Visitor-facing copy:** a new `contact` collection (`src/content/contact/contact.json`, entries `contact` / `contact-es`). It holds every visitor-facing string: the page title, h1, stub text, intro, labels, hints, topic options, errors, states, the privacy line, the preview flag, and the thanks and failure copy. It is read through `getContactPage(locale)` in `src/lib/contact/contact-repository.ts`, with a Zod schema in `schema.ts`.
- **Shared values:** the two non-localized values (team email and privacy approval) go into the existing `settings` singleton as `contactEmail?` and `contactFormPrivacyApproved`.
- **`ui.ts`:** the `contact` block (title, h1, body) is deleted from `src/i18n/ui.ts`. The nav label "Contact" stays there, because this feature doesn't touch the nav.

**Rationale**: FR-GEN5-002/004 and AGENTS.md require JSON copy. Putting the email and the approval flag in `settings` keeps one value for both languages, as FR-UX-012 says "shared by both languages", so they can't drift between `contact` and `contact-es`. The spec's Key Entities list groups them under ContactFormContent. This is a storage detail, not a behaviour change, and it is recorded in `data-model.md`.

**Alternative considered**: A third, non-localized entry inside the `contact` collection. Rejected, because a discriminated-union schema for one collection is more complex than two fields in an existing singleton.

## 7. Form markup: native first, enhanced by script

**Decision**:
- **Form element:** `<form method="post" action={endpoint} data-astro-reload>`. `data-astro-reload` keeps `ClientRouter` from intercepting the cross-origin post.
- **Built-in validation:** native `required`, `type="email"`, `type="tel"`, `maxlength` and `minlength` stay in the markup, so the no-JS path gets the browser's own checks (FR-UX-010). The script adds `novalidate` at init, so the site's validation replaces the browser's messages only when JS runs.
- **Autofill:** `autocomplete` tokens are `name`, `email`, `tel` and `organization`.
- **Topic:** a `<fieldset>` with a `<legend>` and four radios. Value codes come from the contract; labels come from JSON.
- **Honeypot:** field name `website`. It sits inside a wrapper with `aria-hidden="true"`, the input has `tabindex="-1"` and `autocomplete="off"`, and it is moved off-screen with CSS (not `display:none`, which some bots skip). This keeps it out of the accessibility tree (FR-FIELD-003).
- **Hidden fields:** `locale` and `page` are rendered at build time. `renderedAt` is filled by the script at page load, in epoch milliseconds. Without JS it stays empty, and the contract tells the server to skip the minimum-fill-time check when it's empty.

**Rationale**: This is progressive enhancement: US1-AS5 and US3-AS3 need the form to work with JS off.

## 8. Client behaviour: one script, validation in a shared pure module

**Decision**:
- **Rules module:** `src/lib/contact/validation.ts` is pure TypeScript. `validateEnquiry(values) → Partial<Record<Field, ErrorCode>>` implements FR-FIELD-001 exactly as written in `contracts/contact-endpoint.md`: trimmed lengths in UTF-16 code units (the same unit as HTML `maxlength`), the email shape, the topic codes, and the rule that Please call me requires a phone number. It is used by the client script and by the unit tests. It is not Zod: Zod stays in the content layer, and pulling it into a client bundle for seven fields isn't worth the weight.
- **Script:** `src/scripts/contact-form.ts`, initialised on `astro:page-load` and torn down on `astro:before-swap` (the same lifecycle as `motion.ts`). It reads the localized messages from a `<script type="application/json" data-contact-messages>` island rendered from JSON content, so no copy lives in TypeScript (FR-GEN5-002).
- **Send flow:**
  1. Validate. If anything fails, show the error summary and stop (§9).
  2. Otherwise POST the JSON body with an `AbortController` set to 15 s (FR-UX-011), ignoring repeat presses while in flight (FR-UX-009).
  3. Handle the response:
     - `201`: full navigation with `location.assign` to the locale's thanks page. A full load, rather than `navigate()`, guarantees Plausible records the pageview (FR-AN5-001).
     - `422`: map the codes to the same localized messages.
     - `429`: the rate-limited failure message.
     - `5xx`, a network error or the timeout: the generic failure message plus the `mailto:` link (FR-UX-012).
  4. Field values are never cleared (FR-UX-007).
- **Announcements:** a polite live region with `role="status"` announces sending and failure (FR-UX-013).
- **Character count:** the visible count under Message updates on every input. A separate polite live region is debounced by 1 s, so screen readers aren't flooded.
- **Re-validation:** after the first failed send, a field re-validates when it loses focus (FR-UX-002).

## 9. Error summary, focus, Lenis and the fixed nav

**Decision**:
- **Summary:** follows the GOV.UK pattern. It is a `tabindex="-1"` container with a heading and one link per error (`href="#contact-<field>"`, in field order). It is focused programmatically after a failed send. It has no `role="alert"`, because the focus move announces it and a role would make it read twice.
- **Summary links:** the script handles clicks on them itself: `preventDefault()` + `stopPropagation()`, then `field.focus()`. Without this, `motion.ts` → `initAnchors()` would turn the click into a 1.4 s smooth scroll and leave focus on the link. For a radio-group error, focus goes to the first radio.
- **Inline errors:** each is a `<p id="contact-<field>-error">` with visible text and a visually-hidden localized prefix (`Error:`). It is referenced from the field's `aria-describedby` (after any hint), and the field gets `aria-invalid="true"` (FR-UX-004). Not colour alone (FR-UX-008): each message also carries the square lime marker used by `.flag`, with the message text in paper.
- **Title prefix:** while errors are shown, `document.title` gets the localized error word as a prefix (FR-UX-006). It is removed on the next clean validation.
- **Fixed nav (WCAG 2.4.11):** the error summary, every field and the legend get `scroll-margin-top` at least the nav's height. Lenis reconciles with native scrolling (focus-induced scrolls aren't fought), so native `focus()` scrolling is kept. The e2e test asserts the focused element's box is below the nav's bottom edge.
- **Reduced motion:** Lenis isn't even created, and the form itself has no animation.

## 10. The Send button: `Btn.astro` gains a button mode

**Decision**: `Btn.astro` gets an optional `type?: "submit" | "button"`. When `type` is given and `href` isn't, it renders `<button type={type}>` with the identical inner markup and classes. `variant="light"` (lime hairline on forest) is the default for Send. The sending state swaps the label text and sets `aria-busy="true"`. The button is never `disabled` (FR-UX-009).

**Rationale**: CLAUDE.md requires Send to use the `Btn` styling, and requires reusing the `ui/*` shells rather than one-off styles. A second button component would duplicate the dot-and-wipe markup. The change is additive: existing `<Btn href>` calls render byte-identically.

## 11. Layout and visual approach (subject to the mandatory design skills)

**Decision**:
- **Page:** Contact keeps its `PhotoHero` (h1 + intro, which replaces the stub text). The form sits below it in an `Edit` section: sticky heading left (copy in JSON), form right. On small screens it becomes one column.
- **Fields:** single column, one field per row (FR-FIELD-001). Labels use the `.caps` style above each control. "(optional)" is part of the label text.
- **Controls:** transparent on forest with paper text and a 1.5px hairline border in paper at reduced opacity. The border turns lime on focus, plus a 2px lime focus outline with offset. Square corners.
- **Sizes:** control font size is `max(16px, 1em)` (FR-UX-016: no iOS zoom). Radio and checkbox targets are at least 24×24 CSS px (FR-UX-014).
- **Privacy line:** sits directly above Send, as paper text with an underlined Privacy link.

**Process**: `web-design-guidelines` is consulted while building the form and run as an audit on the changed files afterwards. `taste` runs as the final aesthetic pass. `image-to-code` applies only if Vaz supplies a mockup.

## 12. Automated accessibility checks: `@axe-core/playwright` (new dev dependency, justified)

**Decision**: Add `@axe-core/playwright` as a **devDependency**. One e2e spec runs `AxeBuilder` with tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` and `wcag22aa` on these states:
- `/contact` and `/es/contact` in the idle state;
- the same pages showing the error summary;
- the same pages showing the failure state;
- both thanks pages and both error pages.

Each check asserts 0 violations.

**Rationale (Constitution V)**:
- SC-005 requires "automated accessibility checks report 0 violations at WCAG 2.2 AA". That can't be claimed without an automated rules engine.
- axe-core is the industry-standard engine and is maintained by Deque.
- The `@axe-core/playwright` wrapper plugs into the existing Playwright runner.
- It is dev-only: nothing reaches the built site, and it makes no network calls.

**Alternatives considered**:
- Hand-written ARIA assertions only. They are kept anyway (they test behaviour axe can't, like focus moves), but on their own they can't satisfy SC-005.
- Lighthouse CI. Heavier (its own Chrome launcher and server), and it overlaps with axe, whose rules it embeds.

**Needs Vaz's approval before tasks are generated.**

## 13. SC-003 and Plausible: proposed spec delta

**Finding**: There is a conflict inside the spec.
- SC-003 requires "0 requests to third-party hosts from `/contact`… and the thanks/failure pages", and FR-AN5-002 says the form must not load a third-party script.
- But `Layout.astro` loads Plausible from `plausible.io` on **every** page (spec 003, FR-AN-001…004).
- US4 / FR-AN5-001 depend on that script counting the thanks pages.

Read literally, SC-003 would forbid the analytics that US4 needs.

**Decision (proposed delta, Constitution VII)**: Read "third-party" as anything other than these three hosts:
- the site's own origin;
- the configured endpoint's origin;
- the site-wide Plausible script already approved in spec 003.

The form itself adds no third-party request. The e2e test records every request from the Contact and result pages and asserts that each host is on that allowlist, and that no request is made to Plausible with form data. Proposed wording for the spec:
- **Modified (SC-003):** "0 cookies set and 0 requests to hosts other than the site, the form endpoint and the site-wide Plausible script…"
- **Modified (FR-AN5-002):** "…load any third-party script beyond the site-wide analytics script approved in spec 003…"

**Needs Vaz's confirmation**, because it edits an approved success criterion.

## 14. Analytics goals: Plausible configuration, not code

**Decision**: No custom events. The thanks pages are distinct URLs, so Plausible counts them as pageviews. Vaz adds two pageview goals in the Plausible dashboard, `/contact/thanks` and `/es/contact/thanks` (a manual step in `quickstart.md`). The success redirect carries no query string, so no form data can reach an analytics URL (FR-AN5-001). The no-JS `303` from the server must also target the bare path (`contracts/contact-endpoint.md`).

## 15. Mocking the endpoint in e2e

**Decision**: A helper `tests/e2e/support/contact-endpoint.ts` exports `mockContactEndpoint(page, behaviour)`. It routes `https://contact-endpoint.orbolo.test/**` and supports these behaviours:
- `success` (`201`);
- `fieldErrors` (`422` with a codes body);
- `rateLimited` (`429`);
- `serverError` (`500`);
- `networkError` (`route.abort()`);
- `hang` (never fulfils, used with `page.clock` to fast-forward 15 s for FR-UX-011 without a real wait).

The helper answers the CORS preflight (`OPTIONS`) and adds `Access-Control-Allow-Origin` to every response, as a real server would (FR-API-008). It also records every request body, so tests can assert:
- the exact field set (FR-API-002);
- that exactly one POST was sent (US1-AS4);
- that zero were sent on a validation failure (US2-AS1).

The no-JS tests use `test.use({ javaScriptEnabled: false })`. There the helper answers the form POST with a `303` whose `Location` is the local thanks or failure page.

## 16. Topic option copy versus the 2026-10-28 renames

**Finding**: FR-FIELD-002's candidate labels ("Buying beef", "Working with my land") predate the 2026-10-28 nav and card renames ("Beef & Co", "Market", "Education"). The stored codes (`beef`, `land`) are unaffected.

**Decision**: Ship the FR-FIELD-002 wording as the initial JSON copy, since the spec calls it a candidate, and list the alignment as a non-blocking copy question for Vaz. Changing it later is a JSON-only edit.

# Part B: Background-photo refresh (2026-11-14)

The amendment has no `NEEDS CLARIFICATION` markers either. OQ-D1 has a default (`06`), and OQ-D2/D3 don't block building. Three items need Vaz's confirmation before `/speckit-tasks`: §17 (where the photo masters live), §21 (how SC-009 is measured) and §25 (contrast checks also cover Contact and 404). They are listed in `plan.md` → "Decisions awaiting approval".

**Sources.** Modern Web Guidance v1.0.0 was run on 2026-11-14 (`npx -y modern-web-guidance@latest retrieve …`) for `optimize-image-priority`, `deliver-optimized-decorative-images`, `performance`, `color` and `accessibility`. Rules quoted below come from those guides.

**Facts measured in the repo on 2026-11-14 and relied on below:**

- The four shells take `image: string` and render a plain `<img src>` from `public/images/site/`. No image is optimized today: `hero-mist.jpg` is 930 KB and `rider-herd.jpg` 866 KB, served as-is to every device.
- `PhotoHero` already sets `fetchpriority="high"` and no `loading`. `Band`, `Split` and `CtaCollage` already set `loading="lazy"`. No `<img>` has `width`/`height` except the logos.
- Astro 7.3.3 ships `astro:assets` with sharp 0.35.4. It only processes images imported from `src/`. A string path into `public/` is passed through untouched. `<Picture>` has no art direction (no `media` sources); `getImage()` is the public building block.
- `astro dev` re-encodes on every request (no transform cache; only `astro build` caches, in `node_modules/.astro`).
- Motion hooks: CSS `heroDrift` on `.phero__media img`; GSAP on `.phero__media`, `.phero__inner`, `.split__media img`, `.band__bg` and `.cta__collage > *`.
- Text over photos: paper and lime headings (large), paper `.caps`/`.lede`/`.copy` (normal), and the nav at the top of every hero. The nav's current-page link is lime at normal size. Once scrolled, the nav has its own 0.92 forest background.
- No test pins an image path, a shade value or a screenshot. No `Split` uses the `over` slot.
- `public/images/site/orbolo-herd.jpg` is referenced nowhere and is in neither FR-IMG-001 nor FR-IMG-002. It is left alone.

Encoded sizes of the five replacements, measured with Astro's own sharp on the Pexels originals:

| Photo and frame | Width | AVIF q50 | AVIF q45 | WebP q80 | JPEG q80 | AVIF encode |
|---|---|---|---|---|---|---|
| `06` full frame | 1440 | 154 KB | – | 332 KB | 365 KB | 0.7 s |
| `06` full frame | 2560 | 403 KB | 331 KB | 946 KB | 1,052 KB | 1.8 s |
| `06` 2:3 crop | 1080 | 175 KB | 144 KB | – | – | – |
| `05` full frame | 1440 | 177 KB | – | 368 KB | 384 KB | 0.7 s |
| `05` full frame | 2560 | 523 KB | 429 KB | 1,115 KB | 1,200 KB | 2.0 s |
| `05` 2:3 crop | 1080 | 195 KB | 160 KB | – | – | – |
| `09` full frame | 1440 | 36 KB | – | 63 KB | 113 KB | 0.5 s |
| `09` full frame | 2560 | 81 KB | – | 137 KB | 283 KB | 1.1 s |
| `11` full frame (portrait) | 720 / 1440 | 49 / 156 KB | – | 92 / 289 KB | 120 / 400 KB | 0.3 / 0.9 s |
| `08` full frame (portrait) | 720 / 1440 | 41 / 112 KB | – | 80 / 229 KB | 109 / 326 KB | 0.3 / 0.8 s |
| `08` 16:10 crop | 1440 / 2560 | 81 / 194 KB | – | 170 / 410 KB | 210 / 547 KB | 0.5 / 1.2 s |

## 17. Where the replacement photos live: masters in `src/assets/photos/`, processed by `astro:assets`

**Decision**: The five replacements are stored as **masters** in a new folder, `src/assets/photos/`, and delivered through Astro's built-in image pipeline (`getImage()` from `astro:assets`). A small registry, `src/assets/photos/index.ts`, imports the masters and exports one typed entry per photo. The eleven kept photos stay in `public/images/site/`, byte-identical, and keep being passed as plain path strings (FR-IMG-002).

**Rationale**: FR-IMG-006 requires AVIF + WebP + JPEG in several widths, produced by "Astro's built-in image tooling" with no new dependency. That tooling only transforms images imported from `src/`. Only the masters are committed (nine files, §18); every delivered variant is generated at build time, so swapping in real Orbolo photography later (OQ-D3) is a file swap.

**Conflict to flag (Constitution, Additional Constraints → Assets)**: the constitution says site images live in `public/images/<section>/`. That line was written for path-card images referenced from JSON. Astro cannot optimize files there, so FR-IMG-006 and that line can't both hold for these five photos. This plan follows FR-IMG-006 and records the deviation in `plan.md` → Complexity Tracking. It does not edit the constitution. **Needs Vaz's confirmation.**

**Alternatives considered**:
- *Pre-generated variants committed under `public/images/site/`* (a script writes every width and format). It keeps the constitution's folder rule and costs nothing in dev. Rejected as the default for three reasons: about 100 generated binaries (roughly 15 MB) would live in git; the script would need `sharp` as a direct dependency (pnpm doesn't expose Astro's copy to project code); and FR-IMG-006 names Astro's tooling. It is the fallback if Vaz prefers the constitution's wording, or if §26's dev-server risk materialises.
- *CSS `background-image: image-set()`* (the `deliver-optimized-decorative-images` recipe). Rejected: that guide itself warns that CSS images are invisible to the preload scanner and hurt LCP, and FR-IMG-007 requires an `<img>`/`<picture>` in the HTML. `image-set()` also selects by density only, not by width.
- *An image CDN or a different image service*. Rejected: a new dependency and a third-party host.

## 18. Masters and art direction: a wide and a tall frame where the slot changes shape

**Decision**: Nine masters are prepared once from the Pexels originals, by crop and resize only (FR-IMG-004), as sRGB JPEG at quality 90 with metadata stripped. Each crop rectangle is recorded in `.specify/references/new-design/_IMAGES.md` (FR-IMG-012). Preparation uses macOS `sips` (built in), so no script or dependency is added.

| Master (`src/assets/photos/`) | From | Frame | Size (px) | Slot |
|---|---|---|---|---|
| `pasture-herd-wide.jpg` | `06` | full frame, 3:2 | 2560 × 1713 | Home hero, landscape viewports |
| `pasture-herd-tall.jpg` | `06` | 2:3 crop centred near x = 54 % | 1080 × 1620 | Home hero, portrait viewports |
| `calves-sky-wide.jpg` | `05` | full frame, 3:2 | 2560 × 1707 | Invest hero, landscape |
| `calves-sky-tall.jpg` | `05` | 2:3 crop centred near x = 50 % | 1080 × 1620 | Invest hero, portrait |
| `corral-cow-wide.jpg` | `09` | full frame, 3:2 | 2560 × 1707 | Beef hero, landscape |
| `corral-cow-tall.jpg` | `09` | 2:3 crop centred near x = 48 % | 1080 × 1620 | Beef hero, portrait |
| `cows-bells-tall.jpg` | `11` | full frame, 3:4 | 1440 × 1918 | Beef "What we sell today" split |
| `cow-grazing-tall.jpg` | `08` | full frame, 2:3 | 1440 × 2160 | Land split; About band, portrait; Beef collage |
| `cow-grazing-wide.jpg` | `08` | 16:10 crop centred near y = 48 % | 2560 × 1600 | About band, landscape |

File names describe the picture, not the page, so a master can serve several slots. If OQ-D1 resolves to `03`, `herd-sunburst-wide.jpg` and `herd-sunburst-tall.jpg` replace the two `pasture-herd` masters; nothing else changes.

The `<picture>` offers the tall frame to `(max-width: 991px) and (orientation: portrait)`, the site's existing mobile breakpoint, and the wide frame otherwise.

**Rationale**: The hero is `object-fit: cover` in a full-screen box. On a 390 × 844 phone, a 3:2 photo is scaled to 1,266 CSS px wide and only its middle 390 px is visible. A single wide ladder then fails one of two ways: an honest `sizes` makes a 3× phone fetch the 2560 px file, and a dishonest `sizes="100vw"` shows a visibly soft LCP image. A tall crop sends only the pixels the phone shows: the 1080 px rung gives about 1.9× density at 144–160 KB (table above). The About band has the same problem in reverse (a portrait photo in a landscape band), so it gets a wide crop. Cropping the master, rather than asking sharp to crop per request, is required anyway: Astro's `position` option accepts only nine named positions, not a focal point.

**Alternative considered**: one wide ladder with `sizes="100vw"`. Rejected for the softness and waste described above.

## 19. Markup: one internal `Photo.astro`, used by the four shells

**Decision**: A new internal component, `src/components/ui/Photo.astro`, renders every shell photo. The shells' `image` prop widens from `string` to `string | Photo` (the registry type from §17), and they gain two optional props, `focus` and `focusNarrow` (§20).

- **Kept photo (`string`)**: the same single `<img src>` as today, so the eleven kept photos render exactly as before.
- **Master (`Photo`)**: a `<picture>` built with `getImage()`: AVIF then WebP `<source>` elements for each frame (tall frame first, with its `media`), then an `<img>` carrying the JPEG fallback `src` and `srcset`. Every `<source>` and the `<img>` carry `srcset` with `w` descriptors and `sizes`. The `<img>` carries the master's `width`/`height`; tall-frame `<source>` elements carry their own.
- **Both**: `alt`, `decoding="async"`, `data-photo="<name>"` (the master's name, or the kept file's name without extension) and the priority attributes from §22.

Formats are ordered AVIF → WebP → JPEG, as the guidance requires ("order your formats from most optimized to least").

**Widths and `sizes`**:

| Slot | Frame | Widths (px) | `sizes` |
|---|---|---|---|
| PhotoHero | wide | 960, 1440, 1920, 2560 | `max(100vw, 150vh)` |
| PhotoHero | tall | 480, 720, 1080 | `max(100vw, 67vh)` |
| Band | wide | 960, 1440, 1920, 2560 | `max(100vw, 186vh)` |
| Band | tall | 480, 720, 1080 | `max(100vw, 70vh)` |
| Split | tall | 480, 720, 1080, 1440 | `(max-width: 991px) 100vw, max(50vw, 75vh)` |
| CtaCollage | tall | 480, 720 | `(max-width: 991px) 73vw, 20vw` |

`sizes` states the rendered width of the *image*, not of the box: for a `cover` photo that is the larger of the box's width and the box's height times the photo's aspect ratio. `Photo.astro` derives the `vh` term from the master's dimensions, so a new master needs no hand-written `sizes`. A browser that can't parse `max()` in `sizes` falls back to `100vw`, which is safe.

**Quality**: AVIF 45, WebP 70, JPEG fallback 80. At these settings the measured worst cases are 429 KB (`05`, 2560 px) and 160 KB (`05` tall, 1080 px). Compression is not an edit under FR-IMG-004. The values are checked by eye at 100 % on the three heroes during implementation; SC-009's test is the upper bound.

**Motion and layout hooks (FR-IMG-009)**: the class that positions a photo (`band__bg`, `c1`–`c3`) sits on the outermost element `Photo.astro` renders, which is the `<picture>` for a master and the `<img>` for a kept photo. The inner `<img>` of a `<picture>` fills it. `.phero__media img` and `.split__media img` keep matching the `<img>`. So `motion.ts` and the `heroDrift` rule are not edited, and every existing selector still matches exactly one element per photo. This matters most in the collage, where GSAP animates `.cta__collage > *`: the positioned element must stay the direct child.

**Rationale**: FR-IMG-006/007 apply to four shells. One component keeps the `<picture>` logic in one place and keeps the shells' own markup readable. CLAUDE.md asks for reuse of the `ui/*` shells; this adds a helper to them rather than a new section style.

**Alternative considered**: Astro's `<Picture>`. Rejected because it can't emit `media` sources (§18).

## 20. Focal points (FR-IMG-005): two CSS values per slot

**Decision**: Each call site may pass `focus` and `focusNarrow`, both CSS `object-position` values. The shell writes them to the photo as `--photo-focus` and `--photo-focus-narrow`. `global.css` reads `object-position: var(--photo-focus, <today's value>)` and, at `max-width: 991px`, `var(--photo-focus-narrow, var(--photo-focus, <today's value>))`. A kept photo passes neither, so it renders as today.

Starting values, from the originals (final values are set in the browser at 390 px and 1440 px):

| Slot | `focus` | `focusNarrow` | Why |
|---|---|---|---|
| Home hero (`06`) | `50% 62%` | `50% 55%` | Keeps the row of cattle; the sky stays behind the title. |
| Invest hero (`05`) | `50% 60%` | `50% 55%` | The calves sit centre, below the title. |
| Beef hero (`09`) | `50% 35%` | `50% 40%` | Keeps the white cow's head in frame. |
| Beef split (`11`) | `50% 40%` | `50% 40%` | The facing cow and its bell. |
| Land split (`08`) | `40% 50%` | `40% 50%` | The grazing cow, left of centre. |
| About band (`08`) | `50% 50%` | `40% 50%` | Trees behind the heading, cow mid-frame. |
| Beef collage (`08`) | `42% 47%` | `42% 47%` | A square around the cow. |

**Known tension (`09`, Beef hero)**: the layout puts text top-left and bottom-right, and this photo's subject is dead centre. At 1440 px the cow's head sits partly under the right end of the title; on a phone it sits behind the title. `object-position` can't move it sideways when the crop is vertical. FR-IMG-001 fixes the mapping, so this is left for Vaz to judge on the preview (SC-008), not worked around.

## 21. SC-009 byte budgets: how they are measured

**Decision**: The budgets are asserted on the **production build** (§24), on the AVIF response of each replaced photo, under three device conditions:

| Condition | Budget | Largest measured candidate |
|---|---|---|
| 390 × 844 at 3× (a current iPhone) | ≤ 200 KB | 160 KB (`05` tall, 1080 px) |
| 1440 × 900 at 1× | ≤ 450 KB | 177 KB (`05`, 1440 px, at q50) |
| 1440 × 900 at 2× (a current laptop) | ≤ 450 KB | 429 KB (`05`, 2560 px) |

The same test asserts that no response for a replaced photo exceeds 2560 px wide or 1 MB, which is how "the original files MUST NOT be served" is checked.

**Rationale**: SC-009 says "at 390 px" and "at 1440 px" without a pixel density, and density decides which file the browser picks. Testing only at 1× would pass while real phones (2–3×) download something else. The ladders in §19 are capped (1080 px tall, 2560 px wide) so the budgets hold at real densities. **Needs Vaz's confirmation**, because it makes a success criterion more specific.

**Margin**: `05` at 2560 px sits 21 KB under the budget. If the eye check in §19 asks for a higher AVIF quality, the fix is to lower the top wide rung to 2240 px for that photo, not to raise the budget.

## 22. Loading priority (FR-IMG-007)

**Decision**:

| Shell | `fetchpriority` | `loading` | Note |
|---|---|---|---|
| PhotoHero | `high` | attribute absent | The LCP image; in the HTML as `<img>`/`<picture>`. |
| Band, Split, CtaCollage, Split's sketch | attribute absent | `lazy` | Below the fold on every page. |

No image gets `fetchpriority="low"` or `"auto"`. No `<link rel="preload">` is added: the hero `<img>` is in the HTML, so the preload scanner finds it, including the right `<picture>` source.

**Rationale**: This is the `optimize-image-priority` guide applied as written: `high` on the LCP image only, never combined with `lazy`; `lazy` alone for standard below-the-fold images; `low` reserved for images that are above the fold but hidden (the site has none); default priority by omitting the attribute. Each page has exactly one `PhotoHero`, so exactly one `high`. The shells already behave this way today; the change is that tests now pin it, and that it holds for the `<picture>` path.

## 23. Shade model (FR-IMG-008): a floor where text sits, clear elsewhere

**Finding**: With the forest colour `#36472B`, the shade opacity needed for AA over a **pure white** photo is:

| Text over the photo | Required ratio | Minimum shade opacity |
|---|---|---|
| Paper, normal size (`.caps`, `.lede`, `.copy`, nav links) | 4.5:1 | 0.73 |
| Paper, large (`.h1`, `.h2`, `.script`) | 3:1 | 0.57 |
| Lime, large (`.h1`/`.h2`/`.script` in lime) | 3:1 | 0.75 |
| Lime, normal size (the nav's current-page link) | 4.5:1 | 0.89 |

The new skies are close to that worst case. Sampling the lightest pixels behind the title and nav on `06`, `05`, `09` and `03` gives a need of 0.69–0.72 for paper text and 0.86–0.89 for lime at normal size. Today's shade is 0.92 at the centre of a radial gradient that fades to nothing, so a long title (Spanish runs longer) reaches into much weaker shade. That passed on fog; it would not pass on these skies.

**Decision**:

1. **Three tokens** in `global.css`, replacing the unused `--shade`:
   - `--shade-text: 0.76` – behind paper text and behind large lime text;
   - `--shade-text-lime: 0.9` – behind lime text at normal size (the nav strip at the top of a hero);
   - `--shade-clear: 0.06` – everywhere else on the photo.
2. **The shade follows the text, not the viewport.** Each text block over a photo (`.phero__title`, `.phero__side`, `.phero__scroll`, the Band's heading and `.band__foot`) carries its own soft-edged forest pool: at least `--shade-text` everywhere inside the block's box, feathered to `--shade-clear` outside it. `.phero__shade` and `.band__shade` shrink to three jobs: the nav strip at the top of a hero (so that, together with the nav's own gradient, it reaches `--shade-text-lime`), a short blend into the forest section below, and the `--shade-clear` veil.
3. **Contrast holds by construction.** Because the floors are computed against white, AA holds for any photo, any focal point, either language and any point in the hero drift or parallax. Real Orbolo photography (OQ-D3) can be swapped in later without re-tuning.
4. **Split is not touched.** FR-IMG-008 names PhotoHero and Band; no Split puts text over its photo.
5. **Nav is not touched.** Scrolled, it has its own 0.92 background, which already clears every floor above.

**Why this is brighter**: the clear veil drops from today's 0.08–0.30 (desktop) and 0.25–0.60 (phone) to 0.06 across everything that isn't text. Behind text, the shade goes from 0.78–0.92 to 0.76. The photo reads through 24 % behind text instead of 8–22 %.

**Rationale**: The `color` guide sets 4.5:1 and 3:1 as the minimums and says `prefers-contrast` only reinforces a default that already passes, so no `prefers-contrast` variant is added (FR-IMG-008). Tying the pool to the text block removes the guesswork of viewport-anchored gradients, which is what breaks when copy length or the photo changes.

**Alternative considered**: tune the existing radial gradients per photo until measured contrast passes. Rejected: it passes only for today's photos, copy and viewport sizes, and each future photo would need re-tuning.

**Aesthetic risk**: a pool with too little feather reads as a dark box. The feather is designed with `web-design-guidelines` and checked in the `taste` pass; the automated floor test (§25) guards the other direction.

## 24. Forced Colors Mode and a photo that fails to load

**Decision**:
- **Forced colours.** The `color` guide states that Forced Colors Mode removes gradients, `box-shadow` and `text-shadow` and overrides author colours, and that `forced-color-adjust: none` is not for aesthetics. The shade therefore disappears there. Inside `@media (forced-colors: active)`, each text block over a photo gets `background-color: Canvas` (text is already forced to `CanvasText`). The photos stay visible around the text. `forced-color-adjust` is not set anywhere.
- **Failed load.** `.phero`, `.band` and `.split__media` already have a forest background. The photos are decorative (`alt=""`) or have short alt text, and the pools don't depend on the image, so the text stays at 9.84:1 on forest. `Photo.astro` adds nothing that could show a broken-image icon for a decorative image (an empty `alt` suppresses it).

**Rationale**: This is the guide's own remedy ("set both its text and background colors to a pair that meets the minimums"), and it doesn't rely on a browser choosing to paint a backplate behind text.

## 25. Tests for the photo refresh (FR-IMG-TEST-001…004)

**Decision**: Five new e2e specs, one modified spec, one support helper and one unit test.

| Test | Proves | Runs on |
|---|---|---|
| `tests/unit/kept-photos.test.ts` | Each FR-IMG-002 file's SHA-256 equals the value pinned from `HEAD` before any change (SC-012). | Vitest |
| `tests/e2e/photo-slots.spec.ts` | EN and ES, 390 px and 1440 px: every FR-IMG-001 slot shows its replacement (`data-photo`, and the image has decoded); every FR-IMG-002 placement, Contact and 404 still show their current file; no page shows one photo twice. | dev projects |
| `tests/e2e/photo-delivery.spec.ts` | Per page: exactly one `fetchpriority="high"` and it is the hero; no hero is lazy; no `low`/`auto`; every replaced photo has AVIF and WebP sources with `srcset` + `sizes` and reserved dimensions; Split/Band/collage photos are lazy; the layout-shift total while loading and scrolling is 0; the LCP element is the hero photo. | dev projects |
| `tests/e2e/photo-budget-production.spec.ts` | SC-009 under §21's three conditions; the response is AVIF; nothing over 2560 px or 1 MB is requested. | production build |
| `tests/e2e/photo-contrast.spec.ts` | FR-IMG-008 / SC-011 on Home, Invest, Beef, Land, About, Contact and 404, EN and ES, 390 px and 1440 px. | dev projects |
| `tests/e2e/photo-forced-colors.spec.ts` | With forced colours emulated: text blocks over photos have a `Canvas` background and pass the same sampler; nothing sets `forced-color-adjust: none`. | dev, Chromium |
| `tests/e2e/reduced-motion.spec.ts` (modified) | The hero photo still has no animation under reduced motion, on the `<picture>` path too (FR-IMG-009). | `reduced-motion` |

**How contrast is measured** (`tests/e2e/support/photo-contrast.ts`), with reduced motion emulated so nothing moves:
1. Find every text node inside `.phero`, `.band` and the nav (page at the top), and take its line boxes, grown by 8 px.
2. Screenshot the section with the text made transparent, so only the photo and shade remain. Decode it in the page with a canvas, which needs no PNG library.
3. For each line box, take the lightest pixel and compute its ratio against the text's computed colour. Require 4.5:1, or 3:1 when the computed size is at least 24 px, or at least 18.66 px and bold.
4. Repeat with every photo turned white (a test-only `filter`). This asserts the floors of §23 directly, which is what covers the hero drift and any future photo.
5. Attach the per-block results as JSON to the test report (FR-IMG-TEST-003: "results attached to the change").

Axe (`research.md` §12) also runs on the five photo pages. It can't judge text over images, which is why the sampler exists; it guards everything else.

**Scope note**: FR-IMG-TEST-003 lists five pages. The shade lives in shared shells, so Contact's and 404's heroes change too, and their centred titles sit mid-photo where today's shade is weakest. The contrast test therefore covers all seven hero pages. **Needs Vaz's confirmation** as an addition to the spec's list.

**Production build project**: the existing plan's `production-gate` Playwright project (Part A §4) is renamed `production-build`, because it now hosts two specs: the closed contact gate and the photo budgets. Byte sizes are asserted there because that is what ships; in dev the image URLs differ and every response is encoded on request.

**LCP (SC-010)**: Lighthouse is not added as a dependency. Automated: the LCP element is the hero photo and the layout-shift total is 0 (table above). Recorded by hand: `npx lighthouse` (mobile profile) on Home, Invest and Beef of the production build, **before** any change and again after; both sets of numbers go in the change description (`quickstart.md` §5 and §8).

## 26. Dev-server cost of on-request encoding

**Finding**: `astro dev` has no transform cache, and the e2e suite runs against it. An AVIF at 1440 px takes 0.5–0.7 s of CPU from the 20-megapixel originals; from the 2560 px masters it will be less. Every `page.goto` on a hero page waits for that image.

**Decision**: Accept it, measure it, and keep a fallback. The suite's wall time is recorded before and after the change. If it grows by more than about 25 %, or a test starts timing out, the first remedy is a dev-only encoder setting in `astro.config.mjs` (`image.service.config.avif.effort`), which changes speed and not the markup. The second is the pre-generated alternative from §17.

## 27. Alt texts, old files and CLAUDE.md

**Decision**:
- **Alt texts (FR-IMG-010)**: the values of `whatWeSellAlt` and `gappAlt` in `src/i18n/ui.ts` are replaced, in EN and ES, with the spec's candidates. No key is added (AGENTS.md known gap). Neither string names Orbolo, El Tapir or a place (FR-IMG-011). No test pins the old strings. `image-alt-text.spec.ts` keeps passing because every `<img>` still has `alt`.
- **Old files (FR-IMG-012)**: `hero-mist.jpg`, `rider-herd.jpg`, `orbolo-grassfed.jpg`, `zebu-close.jpg` and `rider-green.jpg` are deleted from `public/images/site/` once a repo-wide search finds no reference. They remain in git history.
- **`_IMAGES.md`**: gains a "Site masters" table (master, source photo, crop rectangle, size).
- **CLAUDE.md**: its Design Taste says photos sit "under a forest shade". After the change, `taste` is re-run against localhost (AGENTS.md) and that sentence is updated only if the description no longer fits. The colour tokens and anti-patterns are unchanged: no section gets a light background.
- **Before/after evidence (SC-008)**: screenshots of every replaced slot are taken **before** the first photo is swapped, at 390 px and 1440 px, into `.playwright-mcp/005-photo-refresh/before/`, and again afterwards into `…/after/`.
