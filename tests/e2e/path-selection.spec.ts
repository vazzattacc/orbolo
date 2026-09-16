import { test, expect } from "@playwright/test";

test.describe("Path selection screen (User Story 1)", () => {
  test("renders one card per published path and selecting one navigates to its destination", async ({ page }) => {
    await page.goto("/");

    const cards = page.getByRole("list").getByRole("link");
    // 5 published launch paths (see spec.md Delta: Verdant→Remote Rancher, Business/Meat→Beef).
    await expect(cards).toHaveCount(5);
    await expect(page.getByRole("heading", { name: "Remote Rancher" })).toBeVisible();

    await page.getByRole("link", { name: /Remote Rancher/ }).click();

    await expect(page).toHaveURL("/paths/remote-rancher");
    await expect(page.getByRole("heading", { name: "Remote Rancher" })).toBeVisible();
  });

  test("pressing back after selecting a path returns to the selection screen", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /El Tapir/ }).click();
    await expect(page).toHaveURL("/paths/el-tapir");

    await page.goBack();

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("list").getByRole("link")).toHaveCount(5);
  });

  test("an unknown/pending path has no reachable public URL", async ({ page }) => {
    const response = await page.goto("/paths/does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
