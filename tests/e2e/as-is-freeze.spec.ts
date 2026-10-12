import { expect, test } from "@playwright/test";

// SC-001 — the As-Is Freeze. T043 (adding <Footer> to Layout.astro) landed
// before a dedicated pre-footer runtime baseline could be captured, so T054
// is satisfied differently than originally planned: `git diff HEAD` against
// the pre-003 commit confirmed zero byte-level changes to
// src/pages/{index,invest,beef,land,contact}.astro themselves — only
// Layout.astro (Footer + SEO/meta/Plausible), Nav.astro (trailing-slash
// bug fix), global.css (the approved #bfd55d token), and settings
// files (additive fields, not rendered on these pages) differ from HEAD.
// See research.md for the full record. This test is the forward-looking
// regression guard: it pins known-good title/heading text and asserts the
// footer is appended below existing content, never interleaved into it.
const PAGES = [
  { path: "/", title: "Orbolo", h1: "You own the cattle. Our ranches raise them. Buyers get the beef." },
  {
    path: "/invest",
    title: "Remote Rancher — Orbolo",
    h1: "Be a rancher without leaving home.",
  },
  { path: "/beef", title: "Beef — Orbolo", h1: "Grass-fed beef from Paraguay, at conventional prices." },
  { path: "/land", title: "Land — Orbolo", h1: "El Tapir" },
  { path: "/contact", title: "Contact — Orbolo", h1: "Contact" },
] as const;

const WIDTHS = [390, 1440];

for (const width of WIDTHS) {
  for (const { path, title, h1 } of PAGES) {
    test(`${path} at ${width}px: title, h1, and nav are unchanged`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);

      await expect(page).toHaveTitle(title);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
      await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
    });

    test(`${path} at ${width}px: footer is the last element in body, appears exactly once`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);

      const footers = page.getByRole("contentinfo", { name: "Legal" });
      await expect(footers).toHaveCount(1);

      const isLastChild = await page.evaluate(() => {
        const footer = document.querySelector('footer[aria-label="Legal"]');
        // astro-dev-toolbar is injected by Astro's dev server only (never in
        // a production build) — excluded so this check reflects real markup.
        const siblings = [...document.body.children].filter((el) => el.tagName !== "ASTRO-DEV-TOOLBAR");
        return footer === siblings[siblings.length - 1];
      });
      expect(isLastChild, `footer is not the last element in <body> on ${path}`).toBe(true);
    });
  }
}
