import { expect, test } from "@playwright/test";

// quickstart.md Scenario 1 — FR-INV-001..013, SC-001, SC-006, SC-011

test.describe("Invest page", () => {
  test("every section with real content renders, in order", async ({ page }) => {
    await page.goto("/invest");

    const headings = await page.getByRole("heading", { level: 2 }).allTextContents();
    expect(headings).toEqual([
      "What’s included",
      "Is this real?",
      "Who buys the animal at the end?",
      "What if not enough people join?",
      "What if it goes wrong?",
      "How it works",
      "What you own, precisely",
      "Who verifies what",
      "FAQ",
      "Released at 60%. Nothing paid before then.",
    ]);

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("offer box states terms are on request, with no invented figures", async ({ page }) => {
    await page.goto("/invest");
    const offerBox = page.locator("section", { has: page.getByRole("heading", { name: "What’s included" }) });
    await expect(offerBox).toContainText(/request/i);
    await expect(offerBox).not.toContainText(/\$\d/);
  });

  test("risks section points to the NDA-gated data room, not published specifics", async ({ page }) => {
    await page.goto("/invest");
    const risks = page.locator("section", { has: page.getByRole("heading", { name: "What if it goes wrong?" }) });
    await expect(risks).toContainText(/data room/i);
    await expect(risks).toContainText(/NDA/i);
  });

  test("FAQ's eligibility answer directs the visitor to contact Orbolo, not a stated rule", async ({ page }) => {
    await page.goto("/invest");
    await page.getByText("Who can become a Remote Rancher?").click();
    await expect(page.getByText("Contact us to find out if you’re eligible.")).toBeVisible();
  });

  test("Deployment Pipeline is absent from the DOM (OQ-008: no real ranch data yet)", async ({ page }) => {
    await page.goto("/invest");
    await expect(page.getByRole("heading", { name: "Deployment pipeline" })).toHaveCount(0);
  });

  test("El Tapir and animal-count metrics render with a visible date and source", async ({ page }) => {
    await page.goto("/invest");
    const isThisReal = page.locator("section", { has: page.getByRole("heading", { name: "Is this real?" }) });
    await expect(isThisReal).toContainText("1000 ha");
    await expect(isThisReal).toContainText("500+");
    await expect(isThisReal).toContainText(/as of 2026-09-2\d/);
  });

  test("closing footer line names the contracting entity", async ({ page }) => {
    await page.goto("/invest");
    await expect(page.getByText("Contracting entity: Orbolo")).toBeVisible();
  });

  test("exactly one cross-link to Beef", async ({ page }) => {
    await page.goto("/invest");
    const crossLinks = page.getByRole("link", { name: "See where your beef is sold" });
    await expect(crossLinks).toHaveCount(1);
    await expect(crossLinks).toHaveAttribute("href", "/beef");
  });
});
