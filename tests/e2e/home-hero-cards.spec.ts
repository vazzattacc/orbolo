import { expect, test } from "@playwright/test";

// quickstart.md Scenario 1 — FR-001, FR-002
test("hero renders first; scrolling reveals exactly 3 audience cards", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // No card is inside the initial viewport.
  const firstCard = page.locator("[data-path-card]").first();
  await expect(firstCard).not.toBeInViewport();

  await firstCard.scrollIntoViewIfNeeded();
  const cards = page.locator("[data-path-card]");
  await expect(cards).toHaveCount(3);

  for (const card of await cards.all()) {
    await expect(card.locator("img")).toBeVisible();
    await expect(card.locator("h3").first()).toBeVisible();
  }
});
