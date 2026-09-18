import { test, expect } from "@playwright/test";

test.describe("Invest risks (User Story 2, FR-015)", () => {
  test("every brief risk category is present with a mitigation or a stated absence", async ({ page }) => {
    await page.goto("/en/invest");
    const risks = page.getByRole("heading", { name: "Risks" }).locator("..");
    for (const category of ["Animal loss", "Drought", "Currency", "Policy and export", "Liquidity", "Returns"]) {
      await expect(risks.getByText(category).first()).toBeVisible();
    }
  });

  test("no bare (unnegated) 'guaranteed' appears anywhere on the page", async ({ page }) => {
    await page.goto("/en/invest");
    const bodyText = await page.locator("body").innerText();
    const matches = [...bodyText.matchAll(/\bguaranteed\b/gi)];
    expect(matches.length).toBeGreaterThan(0); // the compliant "never guaranteed" phrasing should be present
    for (const match of matches) {
      const before = bodyText.slice(Math.max(0, match.index! - 15), match.index!).toLowerCase();
      expect(before).toMatch(/\b(never|not|no)\s+$/);
    }
  });
});
