import { test, expect } from "@playwright/test";

test.describe("No-JS navigation (Edge case, FR-023)", () => {
  test("every published card is still a real clickable link that navigates with JavaScript disabled", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto("/");
    await expect(page.getByRole("list").getByRole("link")).toHaveCount(5);

    await page.getByRole("link", { name: /Remote Rancher/ }).click();
    await expect(page).toHaveURL("/paths/remote-rancher");
    await expect(page.getByRole("heading", { name: "Remote Rancher" })).toBeVisible();

    await context.close();
  });
});
