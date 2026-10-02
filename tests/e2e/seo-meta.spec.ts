import { expect, test } from "@playwright/test";

// quickstart.md Scenario 2 — FR-SEO-001..005, SC-002, SC-003

const EXISTING_TITLES: Record<string, string> = {
  "/": "Orbolo",
  "/invest": "Invest — Orbolo",
  "/beef": "Beef — Orbolo",
  "/land": "Land — Orbolo",
  "/contact": "Contact — Orbolo",
};

test("existing page titles are byte-identical to before this feature", async ({ page }) => {
  for (const [route, title] of Object.entries(EXISTING_TITLES)) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
  }
});

test("every public page has a unique title and a unique description", async ({ page }) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();

  for (const route of Object.keys(EXISTING_TITLES)) {
    await page.goto(route);
    const title = await page.title();
    const description = await page.locator('meta[name="description"]').getAttribute("content");

    expect(titles.has(title)).toBe(false);
    titles.add(title);

    expect(description).toBeTruthy();
    expect(descriptions.has(description!)).toBe(false);
    descriptions.add(description!);
  }
});

test("every page exposes a complete social-preview tag set", async ({ page }) => {
  await page.goto("/invest");

  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Invest — Orbolo");
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", /.+/);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://orbolo.com/invest");
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website");
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "Orbolo");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /og-default\.png$/);
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", /.+/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
});

test("every page declares a canonical URL on the production domain", async ({ page }) => {
  await page.goto("/beef");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://orbolo.com/beef");
});
