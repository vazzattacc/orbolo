# Implementation report: 006

One section per phase: what was done, how it was checked, what is left.

## Phase 1: Setup (2026-11-26)

### T001 – `pnpm run verify` on the untouched tree

**Green** (exit 0), 2026-11-26, on the working tree as it stood (including the uncommitted changes from before 006):

| Step | Result |
|---|---|
| `astro check` | 105 files, 0 errors, 0 warnings, 0 hints |
| `eslint .` | no findings |
| Vitest | 16 files, 109 tests passed |
| Playwright | 707 passed, 1 skipped, 3.3 min |

- The skipped test is `path-card-touch.spec.ts` in the desktop `chromium` project; the test skips itself where there is no touch screen, and it ran in `mobile-chrome`.
- One warning in the log: `No items found in src/content/ranches/ranches.json` (empty on purpose since spec 002; the collection goes in Phase 2).

### T002 – Design guidance and shells

- Loaded: `web-design-guidelines` (Vercel Web Interface Guidelines, fetched 2026-11-26) and CLAUDE.md Design Taste.
- No mockup exists for 006, so `image-to-code` does not apply (Constitution X).
- Shell per section: the table in `contracts/pages-ui.md` ("Components and their shells") stands. Heroes `PhotoHero`; Story and the plain text sections `Edit`; closings `CtaCollage`; Capital "problem" a plain section on `--forest-deep`; About chapters with photos `Split`. New components (`StackBox`, `StepList`, `Disclosure`, `Figure`, `PartnerBand`, `ActionBtn`) use the same tokens, square edges and hairlines.

Points from the guidelines that touch decisions already made. **Nothing was changed**; listed so Vaz can decide whether any matters:

| Guideline | Where it meets 006 | Note |
|---|---|---|
| "Title Case for headings/buttons", "placeholders end with …" | deck copy | Deck copy is used verbatim (Governing Rule 1); not applied |
| "`autoFocus` sparingly … avoid on mobile" | panel focus on Name (fix 1, approved) | On phones the keyboard opens with the panel. Kept as approved |
| "Native `<select>`: explicit background and colour" | time-zone list | Implementation detail, will be done |
| "`scroll-margin-top` on anchors" | `#prefer-land`, `#projects`, `#project-<id>` | Already planned (links land below the nav) |
| "Warn before navigation with unsaved changes" | panels keep values only while the page stays | Not in the spec; not added |

### T003 – Modern Web Guidance, second run

- Retrieved on 2026-11-26 with code examples: dialog, accordion, forms, motion, optimize-image-priority, performance, prevent-page-scroll-under-modal-dialog, required-field-feedback, validate-input-after-interaction, accessible-error-announcement. Dialog, accordion, motion and scroll guides are identical to the copies read while planning.
- **No advice contradicts a requirement**, so no delta is proposed. Implementation details taken from it:
  - hints (phone, counter) go between label and control, so keyboards and autofill popups don't cover them;
  - every form keeps an accessible name; `aria-invalid` and `aria-describedby` only while an error stands (005 behaviour, kept);
  - one image with `fetchpriority="high"` per page, never with `loading="lazy"`; no `fetchpriority="low"` on lazy images.
- Two observations for Vaz, not changes:
  - The guides mark required fields; the deck marks only the optional one ("(optional)"). The plan follows the deck.
  - With the gate closed, pressing Send on a valid form gives no message at all (FR-GATE6-001). A screen-reader user hears nothing. That is what the spec asks for while the site is only for seeing the design; worth revisiting before the public launch (OQ-006-P1).
