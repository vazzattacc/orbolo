import { expect, test } from "@playwright/test";

// quickstart.md Scenario 1 — FR-404-001..004, SC-004

test("requesting a non-existent path returns a real 404 status", async ({ page }) => {
  const response = await page.goto("/this-does-not-exist");
  expect(response?.status()).toBe(404);
});

test("the branded 404 page has nav, heading, one line, and a Home link", async ({ page }) => {
  await page.goto("/this-does-not-exist");

  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Page not found", level: 1 })).toBeVisible();
  const homeLink = page.getByRole("link", { name: "Back to Home" });
  await expect(homeLink).toBeVisible();
  await expect(homeLink).toHaveAttribute("href", "/");
});

test("the 404 page is marked noindex and excluded from the sitemap", async ({ page, request }) => {
  await page.goto("/this-does-not-exist");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");

  const sitemapResponse = await request.get("/sitemap.xml");
  const sitemapBody = await sitemapResponse.text();
  expect(sitemapBody).not.toContain("/404");
});

test("Home link from the 404 page actually returns Home", async ({ page }) => {
  await page.goto("/this-does-not-exist");
  await page.getByRole("link", { name: "Back to Home" }).click();
  await expect(page).toHaveURL(/\/$/);
});
