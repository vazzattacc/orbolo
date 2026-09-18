import { test, expect } from "@playwright/test";

test.describe("Invest / Remote Rancher (User Story 2)", () => {
  test("offer box never phrases ownership as land, a fund unit, or investing with Orbolo", async ({ page }) => {
    await page.goto("/en/invest");
    const ownText = await page.getByText("What you own, precisely").locator("..").textContent();
    expect(ownText?.toLowerCase()).toContain("specific animals");
    expect(ownText?.toLowerCase()).not.toContain("invest with orbolo");
    expect(ownText).toMatch(/Not land, not a fund unit/i);
  });

  test("a ranch card shows every FR-008 required field", async ({ page }) => {
    await page.goto("/en/invest");
    const card = page.locator("article[data-ranch-status]").first();
    await expect(card).toContainText("Ranch 04");
    await expect(card).toContainText("Boquerón");
    await expect(card).toContainText("1200 ha");
    await expect(card).toContainText("MPCS member");
    await expect(card).toContainText("Committed under LOI");
    await expect(card).toContainText("Cycle:");
    await expect(card).toContainText("Updated");
  });

  test("progress bar reflects only signed/unexpired LOI head counts, and shows the release rule", async ({ page }) => {
    await page.goto("/en/invest");
    const card = page.locator("article[data-ranch-status]").first();
    await expect(card).toContainText("Committed under LOI: 260 / 400 head");
    await expect(card).toContainText("released for deployment at 60% under signed LOI");
    await expect(card).toContainText("No capital is called before release");
  });

  test("'Get the investor pack' section requires only an email (light room, no NDA)", async ({ page }) => {
    await page.goto("/en/invest");
    const formSection = page.locator("#form-investor");
    await expect(formSection).toBeVisible();
    await expect(formSection.getByText(/NDA/i)).toHaveCount(0);
  });

  test("contracting entity footer line is present", async ({ page }) => {
    await page.goto("/en/invest");
    await expect(page.locator("footer").getByText(/Remote Rancher is operated by/)).toBeVisible();
  });

  test("a ranch card's CTA is a real, working link into the investor-pack flow, not a dead button", async ({ page }) => {
    await page.goto("/en/invest");
    const card = page.locator("article[data-ranch-status]").first();
    const cta = card.getByRole("link", { name: "Sign a Letter of Intent" });
    await expect(cta).toHaveAttribute("href", "/en/invest#form-investor");
    await cta.click();
    await expect(page.locator("#form-investor")).toBeInViewport();
  });
});
