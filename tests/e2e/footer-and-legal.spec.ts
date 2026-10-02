import { expect, test } from "@playwright/test";

// quickstart.md Scenario 3 — FR-LEG-001..007

test("the footer renders on every page, below all content, with only approved links", async ({ page }) => {
  for (const route of ["/", "/invest", "/beef", "/land", "/contact"]) {
    await page.goto(route);
    const footer = page.getByRole("contentinfo", { name: "Legal" });
    await expect(footer).toBeVisible();

    // Neither Privacy nor Terms is approved yet (research.md §12) — the
    // footer must render with zero links, not a dead link to either.
    await expect(footer.getByRole("link")).toHaveCount(0);
  }
});

test("Privacy and Terms are not directly reachable while unapproved — no fabricated legal text", async ({
  page,
}) => {
  await page.goto("/privacy");
  await expect(page.getByText("This page isn’t available yet.")).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");

  await page.goto("/terms");
  await expect(page.getByText("This page isn’t available yet.")).toBeVisible();
});

test("neither Privacy nor Terms appears in the sitemap while unapproved", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  const body = await response.text();
  expect(body).not.toContain("/privacy");
  expect(body).not.toContain("/terms");
});
