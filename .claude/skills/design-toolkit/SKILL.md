---
name: design-toolkit
description: Router for a five-part frontend/design toolkit — Taste Skill, Web Design Guidelines, Awesome Design, Image to Code, and Playwright CLI. Use when a task touches UI/frontend work — extracting a site's design language, auditing accessibility/UX quality, browsing design references, turning a visual mockup into code, or verifying a built UI in a real browser — so the right sub-skill fires instead of guessing from memory.
---

# Design Toolkit Router

This is an index skill. It doesn't do design work itself — it tells Claude which of the five installed skills below to reach for, based on what the user is actually asking for. Read the matching section, then defer to that skill's own SKILL.md for the full workflow.

## 1. Taste Skill
**What it does:** Reverse-engineers an existing website's "design taste" — not just raw tokens (colors, fonts, radii) but the *reasoning* behind them, so a generated UI doesn't just copy numbers and produce generic output.
**When to invoke:** User gives a reference URL and says something like "make it feel like [site]" or asks to extract/borrow a site's design language.
**Typical invocation:** `/taste <url>`
**Dependency:** Requires Playwright MCP installed (`claude mcp add playwright -s user -- npx -y @playwright/mcp@latest --isolated`).

## 2. Web Design Guidelines
**What it does:** Audits existing frontend code — not generation, review. Checks ARIA labeling and semantic HTML, focus-visible states, form autocomplete/paste handling, compositor-friendly animation, typography, i18n/Intl formatting, hydration-safety, and a set of known code-smell patterns.
**When to invoke:** User wants a UI/UX or accessibility quality check on files that already exist, or asks "review this component/page for accessibility/UX issues."
**Typical invocation:** Pass a file or glob pattern; if none given, ask the user which files to review before running.

## 3. Awesome Design
**What it does:** *(Flagging this one — I couldn't confirm a single specific package matching this exact name; several curated design-reference/inspiration libraries go by similar names.)* Treat it as your curated pattern/inspiration reference until confirmed otherwise.
**When to invoke:** User wants design inspiration, pattern examples, or a reference library to browse rather than a live-site extraction or an audit.
**Action needed:** If you have a specific repo or marketplace source for this one, share it (or the plugin's actual `name:` from its SKILL.md) and I'll replace this section with accurate trigger conditions and commands.

## 4. Image to Code
**What it does:** Converts a visual design reference (screenshot, mockup, Figma export) into production frontend code via a mandatory *image-first* workflow: generate high-resolution, section-specific images of the target design, analyze typography/spacing/layout from those images, then implement — never coding straight from a vague description. Explicitly guards against "card spam," over-compressed layouts, and illegible text.
**When to invoke:** User provides or wants a visual mockup as the source of truth for a landing page, hero section, or any layout where visual fidelity to a reference matters more than speed.
**Key rule to preserve:** Never crop/reuse an old generated image for a detail view — regenerate fresh per section.

## 5. Playwright CLI
**What it does:** Browser automation and UI verification. Drives a real browser to check behavior across states/viewports, capture screenshots, and read console output — closes the loop on code Claude wrote but can't visually judge on its own.
**When to invoke:** After Image to Code or any UI change, to verify the result actually renders/behaves as intended, or for general web automation/testing tasks.
**Typical invocation:** `playwright-cli install --skills` (one-time setup), then Claude discovers and uses the bundled Playwright skill automatically when a testing/verification task matches.

## Suggested pairing pattern
For a full "reference → build → verify" pass: **Taste** or a user-supplied mockup → **Image to Code** (implement) → **Web Design Guidelines** (accessibility/quality audit) → **Playwright CLI** (visual/behavioral verification).
