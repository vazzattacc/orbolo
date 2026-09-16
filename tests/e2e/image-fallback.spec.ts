import { test, expect } from "@playwright/test";

test.describe("Broken image fallback (Edge case, FR-021)", () => {
  test("an entry with an unresolvable image still renders a selectable card with the branded fallback", async ({ page }) => {
    // Force every path image request to fail, simulating a broken URL/missing
    // asset, without needing a second real broken-image fixture in paths.json.
    await page.route("**/_next/image**", (route) => route.abort());
    await page.route("**/images/paths/*.svg", (route) => route.abort());

    await page.goto("/");

    const firstCard = page.getByRole("list").getByRole("link").first();
    await expect(firstCard).toBeVisible();
    // The shared branded fallback is a gradient div rendered in place of the
    // <img>, once the image's onError fires.
    await expect(firstCard.locator("img")).toHaveCount(0);
    await expect(firstCard).toBeEnabled();
    await expect(page.getByText("El Tapir")).toBeVisible();
  });
});
