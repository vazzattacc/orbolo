import { expect, test } from "@playwright/test";

// quickstart.md Scenario 4 — FR-QA-001/FR-QA-002: every <img> on every
// shipped page must have an alt attribute (non-empty for content images,
// explicitly empty for decorative ones).
const ROUTES = ["/", "/invest", "/beef", "/land", "/about", "/contact", "/404", "/privacy", "/terms"];

test("every <img> on every shipped page has an alt attribute", async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route);
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      const src = await images.nth(i).getAttribute("src");
      expect(alt, `${route}: <img src="${src}"> is missing an alt attribute`).not.toBeNull();
    }
  }
});
