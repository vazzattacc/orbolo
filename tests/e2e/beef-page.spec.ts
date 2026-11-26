import { expect, test } from "@playwright/test";
import { bodyTextOutsideRegenerativeException } from "./approved-exceptions";

// spec 002 — FR-BEEF-001..010, SC-001, SC-003

test.describe("Beef page", () => {
  test("every section with real content renders, in order", async ({ page }) => {
    await page.goto("/beef");

    const headings = await page.getByRole("heading", { level: 2 }).allTextContents();
    expect(headings).toEqual([
      "What we sell today",
      "The promise",
      "First pick",
      "Why supply from the group is different",
      "Who verifies what",
    ]);

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("'regenerative' appears only in the flagged What-we-sell sentence", async ({ page }) => {
    await page.goto("/beef");
    const section = page.locator('section[aria-labelledby="what-we-sell-heading"]');
    await expect(section).toContainText("regenerative standard");
    await expect(section.locator(".flag")).toHaveText("*Against the “never use ‘regenerative’” rule");
    expect(await bodyTextOutsideRegenerativeException(page)).not.toContain("regenerative");
  });

  test("no named customer appears anywhere", async ({ page }) => {
    await page.goto("/beef");
    const bodyText = (await page.locator("body").innerText()).toLowerCase();
    expect(bodyText).not.toContain("customer");
  });

  test("roadmap section is absent from the DOM (OQ-010: no dated milestones yet)", async ({ page }) => {
    await page.goto("/beef");
    await expect(page.getByRole("heading", { name: "Roadmap" })).toHaveCount(0);
  });

  test("exactly one cross-link to Invest", async ({ page }) => {
    await page.goto("/beef");
    const crossLinks = page.getByRole("link", { name: "Own the herd behind this beef" });
    await expect(crossLinks).toHaveCount(1);
    await expect(crossLinks).toHaveAttribute("href", "/invest");
  });
});
