# Quickstart: Validating the Contact Form and the Photo Refresh

How to prove the feature works. §1–§4 cover the contact form (2026-11-11, unchanged apart from one project name in §1). §5–§8 cover the background-photo refresh (2026-11-14).

Contracts: `contracts/contact-endpoint.md`, `contracts/contact-form-ui.md` and `contracts/photo-delivery-ui.md`. Data: `data-model.md`.

## Prerequisites

- `pnpm install`. This also installs the two dev dependencies added by this feature: `@axe-core/playwright` (`research.md` §12) and `sharp` (needed by `astro build` for the photos).
- `.env.development` is committed with the reserved `.test` endpoint and `CONTACT_FORM_PREVIEW=true`. No secrets, and no real server is needed.

## 1. Everything automated

```bash
pnpm run verify
```

`pretest:e2e` starts two servers before the tests run:
- the dev server on `:4321`, which shows the form in preview mode;
- a production build served on `:4322`, which shows the closed gate.

Expected result: green. The scenarios below are what those tests cover. Run one alone with `npx playwright test <file>`.

| # | Scenario | Spec | Where |
|---|---|---|---|
| 1 | Valid send (EN and ES) → one POST with the exact contract fields → thanks page in the same language | US1-AS1/2, FR-API-002 | `tests/e2e/contact-form.spec.ts` |
| 2 | No topic preselected when arriving from a CTA; a double press sends once; the sending state shows | US1-AS3/4, FR-UX-009 | `contact-form.spec.ts` |
| 3 | JS disabled: the native post lands on thanks, or on the error page when the endpoint fails | US1-AS5, US3-AS3 | `contact-form-no-js.spec.ts` |
| 4 | Empty send and a bad email: summary focused, entries in order, inline errors, `aria-invalid`, title prefix, values kept, 0 requests; `422` codes rendered the same way | US2-AS1…5 | `contact-form-errors.spec.ts` |
| 5 | Endpoint `500`, network error, `429`, 15 s hang (fast-forwarded clock): failure message with `mailto:`, values kept, never the thanks page | US3-AS1/2, FR-UX-011/012 | `contact-form-failure.spec.ts` |
| 6 | Keyboard-only completion; summary links focus their fields; focused element never under the nav; reduced-motion run | FR-UX-014, edge cases | `contact-form-a11y.spec.ts` (+ the `reduced-motion` project) |
| 7 | axe WCAG 2.2 AA: 0 violations in the idle, error and failure states and on the result pages, in both languages | SC-005 | `contact-form-a11y.spec.ts` |
| 8 | 390 px and 1440 px: no horizontal scroll; input font ≥ 16 px | FR-UX-016 | `contact-form-a11y.spec.ts` |
| 9 | 0 cookies, no storage, every request host on the allowlist, nothing sent to analytics | FR-AN5-002, SC-003 (amended) | `contact-form-privacy.spec.ts` |
| 10 | Production build, gate closed: stub shown, result pages 404, sitemap clean, no `<form>` | FR-GATE-001, SC-007 | `contact-gate-production.spec.ts` (project `production-build`, renamed from `production-gate`: `research.md` §25) |
| 11 | Validation rules: every field, boundary lengths, Please call me without a phone | FR-TEST-001 | `tests/unit/contact-validation.test.ts` |
| 12 | Gate truth table: all condition combinations, preview ignored outside dev | FR-GATE-001 | `tests/unit/contact-gate.test.ts` |
| 13 | Content: EN and ES entries present, every error code translated, banned words absent | FR-GEN5-002/003 | `tests/unit/contact-repository.test.ts` + `content-compliance.spec.ts` (`/contact` added) |

## 2. Look at it in a real browser (AGENTS.md: Playwright is mandatory for UI)

With `pnpm dev` running, use the Playwright MCP or the `playwright-cli` skill to check:

- `/contact` and `/es/contact` at 1440×900 and 390×844. Screenshots go to `.playwright-mcp/`.
- These states, at both sizes:
  - the idle form;
  - after an empty Send (summary plus inline errors);
  - after a Send that fails (the dev endpoint is unreachable, so a real send in the browser shows the failure state; no mock is needed for this visual check).
- Hover and focus on every control and on Send.
- The same pages under emulated `prefers-reduced-motion: reduce`.
- The console: no errors besides the known Plausible "Ignoring Event: localhost" warning.

Then run `web-design-guidelines` on the changed files and `taste` as the final pass (Constitution X).

## 3. The closed gate, by hand

```bash
env -u PUBLIC_CONTACT_ENDPOINT -u CONTACT_FORM_PREVIEW pnpm build
ls dist/contact            # → index.html only, no thanks/ or error/
grep -c "<form" dist/contact/index.html   # → 0
```

## 4. Before going live (outside this repo, after the open questions are answered)

1. The backend (separate spec) is deployed and passes `contracts/contact-endpoint.md`. Check it with `curl -i -X OPTIONS` and a JSON `POST` from the allowed origin.
2. In `settings.json`:
   - `contactEmail` is set (OQ-C1);
   - `contactFormPrivacyApproved` is `true` (OQ-C3).
3. `legal.json` → `privacy.approved` is `true`, with the Privacy text covering the form (FR-LEG5-002, supplied or approved by Vaz/counsel).
4. The production build environment (Firebase/GitLab CI) sets `PUBLIC_CONTACT_ENDPOINT`.
5. Build and deploy. `/contact` now shows the form, and `/contact/thanks` exists.
6. Plausible dashboard: add pageview goals `/contact/thanks` and `/es/contact/thanks` (`research.md` §14).
7. Smoke test on production: send one real enquiry in each language. Confirm it lands in the team inbox and in the server's store.

## 5. Photo refresh: capture the "before" state first

Do this **before** any photo, shell or shade is changed. It can't be recreated afterwards without checking out old code.

1. **Screenshots (SC-008).** With `pnpm dev` running, use the Playwright MCP or the `playwright-cli` skill to capture each slot in `data-model.md` §7 "Slots that change", at 1440×900 and 390×844, into `.playwright-mcp/005-photo-refresh/before/`.
2. **Kept-photo hashes (SC-012).** Record the SHA-256 of every FR-IMG-002 file. These become the pinned values in `tests/unit/kept-photos.test.ts`.

   ```bash
   shasum -a 256 public/images/site/* public/images/paths/* public/images/brand/* public/images/branding/* public/images/social/*
   ```

3. **Lighthouse baseline (SC-010).** Build and serve the current site, then record LCP and CLS for Home, Invest and Beef. Lighthouse runs through `npx` and is not added to `package.json`.

   ```bash
   pnpm build && npx astro preview --port 4322
   npx lighthouse http://localhost:4322/ --only-categories=performance --form-factor=mobile --output=json --output-path=.playwright-mcp/005-photo-refresh/before/home.json
   ```

   Repeat for `/invest` and `/beef`.
4. **Suite time (`research.md` §26).** Note the wall time of `pnpm run test:e2e`.

## 6. Photo refresh: everything automated

```bash
pnpm run verify
```

Expected result: green. Run one scenario alone with `npx playwright test <file>`.

| # | Scenario | Spec | Where |
|---|---|---|---|
| 14 | Every FR-IMG-002 file is byte-identical to its pinned hash | FR-IMG-002, SC-012 | `tests/unit/kept-photos.test.ts` |
| 15 | EN and ES, 390 px and 1440 px: each replaced slot shows its replacement and it has decoded; each kept placement, Contact and 404 show their current file; no page repeats a photo | FR-IMG-001/002/003, FR-IMG-TEST-001, US5-AS1/2/3 | `tests/e2e/photo-slots.spec.ts` |
| 16 | One `fetchpriority="high"` per page and it is the hero; no lazy hero; no `low`/`auto`; AVIF and WebP sources with `srcset` + `sizes`; reserved dimensions; below-the-fold photos lazy; layout identical with photos blocked and loaded; the hero photo is the only image requested at high priority | FR-IMG-006/007, FR-IMG-TEST-002, SC-010 (automated part) | `tests/e2e/photo-delivery.spec.ts` |
| 17 | Production build: AVIF served; ≤ 200 KB at 390 px (3×); ≤ 450 KB at 1440 px (1× and 2×); nothing over 2560 px or 1 MB | SC-009, US5-AS4 | `tests/e2e/photo-budget-production.spec.ts` (project `production-build`) |
| 18 | Text over photos: 4.5:1, or 3:1 for large text, against the real photo and against white; seven hero pages, EN and ES, 390 px and 1440 px; results attached as JSON | FR-IMG-008, FR-IMG-TEST-003, SC-011 | `tests/e2e/photo-contrast.spec.ts` |
| 19 | Forced colours: text blocks over photos have a `Canvas` background and stay readable; nothing sets `forced-color-adjust: none` | FR-IMG-008, US5-AS6 | `tests/e2e/photo-forced-colors.spec.ts` |
| 20 | Reduced motion: the hero photo has no animation, on the `<picture>` path too | FR-IMG-009, US5-AS6 | `tests/e2e/reduced-motion.spec.ts` |
| 21 | Every `<img>` still has `alt`; the two Split alts describe the new photos in EN and ES | FR-IMG-010/011, US5-AS5 | `tests/e2e/image-alt-text.spec.ts` (existing) + `photo-slots.spec.ts` |
| 22 | Axe: 0 violations on Home, Invest, Beef, Land and About, in both languages | FR-IMG-TEST-003, SC-011 | `tests/e2e/photo-contrast.spec.ts` (needs `@axe-core/playwright`, `research.md` §12) |

## 7. Photo refresh: look at it in a real browser

With `pnpm dev` running, use the Playwright MCP or the `playwright-cli` skill:

- Home, Invest, Beef, Land and About, in EN and ES, at 1440×900 and 390×844. Capture the same slots as in §5 into `.playwright-mcp/005-photo-refresh/after/`.
- For each replaced slot, check that the main animals are in frame at both sizes, and adjust `focus` / `focusNarrow` if not (`research.md` §20).
- Look at the edges of every shade pool at both sizes. It must not read as a dark box. The Beef hero is the one to look at hardest (`research.md` §20, "Known tension").
- Zoom the three heroes to 100 % and check for compression artefacts in the sky and grass (`research.md` §19, "Quality").
- Contact and 404: same photo as before, and the centred title is readable.
- Emulate `prefers-reduced-motion: reduce`: no drift, no parallax, text readable.
- Emulate forced colours (Playwright `emulateMedia({ forcedColors: "active" })`): text sits on a solid system-colour background.
- Block one hero image request and reload: forest background, readable text, no broken-image icon.
- The console: no errors besides the known Plausible "Ignoring Event: localhost" warning.

Then run `web-design-guidelines` on the changed files and `taste` as the final pass (Constitution X). Re-run `taste` against localhost and update CLAUDE.md's Design Taste only if its description of the photo shade no longer fits.

## 8. Photo refresh: evidence to attach to the change

1. Before/after screenshots of each replaced slot, side by side, for Vaz's approval (SC-008). Include the Home hero with `03` from a local, uncommitted swap so OQ-D1 can be decided.
2. The contrast results JSON from scenario 18 (FR-IMG-TEST-003).
3. Lighthouse LCP and CLS for Home, Invest and Beef, before and after (SC-010). Run the "after" on the production build exactly as in §5.3.
4. The e2e suite's wall time, before and after (`research.md` §26).
5. `git diff --stat` showing no change under `public/images/` other than the five deleted files, and no copy change other than the two alt texts (SC-012).
