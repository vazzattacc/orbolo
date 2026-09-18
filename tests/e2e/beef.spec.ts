import { test, expect } from "@playwright/test";

test.describe("Beef (User Story 3)", () => {
  test("now/building/target staging is visually distinct and dated", async ({ page }) => {
    await page.goto("/en/beef");
    await expect(page.getByText("Now").first()).toBeVisible();
    await expect(page.getByText("Building").first()).toBeVisible();
    await expect(page.getByText("Target").first()).toBeVisible();
    await expect(page.getByText(/Target 2028-01-01/)).toBeVisible();
  });

  test("'regenerative' does not appear describing today's product", async ({ page }) => {
    await page.goto("/en/beef");
    const bodyText = (await page.locator("body").innerText()).toLowerCase();
    expect(bodyText).not.toContain("regenerative");
  });

  test("conventional-price and first-pick promises are both present", async ({ page }) => {
    await page.goto("/en/beef");
    await expect(page.getByText(/conventional market prices/i).first()).toBeVisible();
    await expect(page.getByText(/first pick/i).first()).toBeVisible();
  });

  test("spec-sheet and sample-request actions are present and independent of Invest", async ({ page }) => {
    await page.goto("/en/beef");
    await expect(page.getByRole("link", { name: "Get the spec sheet" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Request a sample" })).toBeVisible();
    await expect(page.locator("#form-buyer")).toBeVisible();
  });

  test("exactly one cross-link to Invest (FR-037)", async ({ page }) => {
    await page.goto("/en/beef");
    const crossLinks = page.getByRole("link", { name: "Own the herd behind this beef" });
    await expect(crossLinks).toHaveCount(1);
    await expect(crossLinks).toHaveAttribute("href", "/en/invest");
  });
});
