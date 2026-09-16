import { test, expect } from "@playwright/test";

test.describe("No-JS navigation (Edge case, FR-023)", () => {
  test("every published card is still a real clickable link that navigates with JavaScript disabled", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto("/");
    await expect(page.getByRole("list").getByRole("link")).toHaveCount(4);

    await page.getByRole("link", { name: /Verdant/ }).click();
    await expect(page).toHaveURL("/paths/verdant");
    await expect(page.getByRole("heading", { name: "Verdant" })).toBeVisible();

    await context.close();
  });
});
