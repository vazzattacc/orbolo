import { expect, test } from "@playwright/test";

// quickstart.md Scenario 5 — FR-AN-001/002/003/004 (research.md §7).
const ROUTES = ["/", "/invest", "/beef", "/land", "/contact"];

test("the Plausible script tag is present on every page with the right domain and defer", async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route);
    const script = page.locator('script[src="https://plausible.io/js/script.js"]');
    await expect(script).toHaveAttribute("data-domain", "orbolo.com");
    await expect(script).toHaveAttribute("defer", "");
  }
});

test("no cookies are set after a full page load", async ({ page, context }) => {
  await page.goto("/");
  const cookies = await context.cookies();
  expect(cookies).toHaveLength(0);
});

test("no consent-banner element exists in the DOM", async ({ page }) => {
  await page.goto("/");
  const bannerCandidates = page.locator(
    '[id*="consent" i], [class*="consent" i], [id*="cookie-banner" i], [class*="cookie-banner" i]',
  );
  await expect(bannerCandidates).toHaveCount(0);
});

test("with the Plausible request blocked, the page still renders and the flip cards still work", async ({
  page,
}) => {
  await page.route("https://plausible.io/**", (route) => route.abort());

  // The blocked request itself logs a browser-level "Failed to load
  // resource" line — that's the expected byproduct of the abort below, not
  // an app error, so it's excluded from the assertion.
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error" && !msg.text().includes("Failed to load resource")) {
      consoleErrors.push(msg.text());
    }
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const card = page.locator("[data-path-card]").first();
  await card.scrollIntoViewIfNeeded();
  const trigger = card.locator("[data-path-card-trigger]");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  expect(consoleErrors).toHaveLength(0);
});
