import { test, expect } from "@playwright/test";

test.describe("Path selection screen (User Story 1)", () => {
  test("renders one card per published path and selecting one navigates to its destination", async ({ page }) => {
    await page.goto("/");

    const cards = page.getByRole("list").getByRole("link");
    // 4 published launch paths — business-meat stays hidden while pending.
    await expect(cards).toHaveCount(4);
    await expect(page.getByRole("heading", { name: "Verdant" })).toBeVisible();

    await page.getByRole("link", { name: /Verdant/ }).click();

    await expect(page).toHaveURL("/paths/verdant");
    await expect(page.getByRole("heading", { name: "Verdant" })).toBeVisible();
  });

  test("pressing back after selecting a path returns to the selection screen", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /El Tapir/ }).click();
    await expect(page).toHaveURL("/paths/el-tapir");

    await page.goBack();

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("list").getByRole("link")).toHaveCount(4);
  });

  test("a pending path (business-meat) has no reachable public URL", async ({ page }) => {
    const response = await page.goto("/paths/business-meat");
    expect(response?.status()).toBe(404);
  });
});
