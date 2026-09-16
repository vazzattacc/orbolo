import { test, expect } from "@playwright/test";

test.describe("Touch accessibility (User Story 2)", () => {
  test("tapping a card selects its path without any prior hover event", async ({ page, hasTouch }) => {
    test.skip(!hasTouch, "Touch tap behavior requires a touch-enabled browser context");

    await page.goto("/");
    const firstCard = page.getByRole("list").getByRole("link").first();

    await firstCard.tap();

    await expect(page).toHaveURL(/\/paths\//);
  });
});
