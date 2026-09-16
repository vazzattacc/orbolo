import { test, expect } from "@playwright/test";

test.describe("Keyboard accessibility (User Story 2)", () => {
  test("every published card is reachable and activatable via Tab + Enter, with a visible focus indicator", async ({ page }) => {
    await page.goto("/");
    const cards = page.getByRole("list").getByRole("link");
    const count = await cards.count();
    expect(count).toBe(5);

    // Tab through the document until the first card receives focus.
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      const active = await page.evaluate(() => document.activeElement?.textContent);
      if (active?.includes("El Tapir")) break;
    }

    await expect(cards.first()).toBeFocused();
    // A visible focus ring is applied via focus-visible:ring-* — confirm an
    // outline/box-shadow is actually rendered, not just present as a class.
    const boxShadow = await cards.first().evaluate((el) => getComputedStyle(el).boxShadow);
    expect(boxShadow).not.toBe("none");

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/paths\//);
  });

  test("Space also activates a focused card", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("list").getByRole("link").first().focus();
    await page.keyboard.press("Space");
    await expect(page).toHaveURL(/\/paths\//);
  });
});
