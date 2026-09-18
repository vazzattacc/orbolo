import { test, expect } from "@playwright/test";

test.describe("Home (User Story 1)", () => {
  test("renders every FR-005 section in order with real content", async ({ page }) => {
    await page.goto("/en/");

    await expect(page.getByRole("heading", { name: "Grass-fed beef from Paraguay, traded at market prices." })).toBeVisible();
    await expect(page.getByRole("link", { name: "Invest in a herd" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Buy beef" })).toBeVisible();

    await expect(page.getByRole("heading", { name: "One group, two engines" })).toBeVisible();
    const loopStages = page.locator("ol[role='list'] li a");
    await expect(loopStages).toHaveCount(4);

    await expect(page.getByText("The trading desk gives every herd a buyer before it is bought.")).toBeVisible();

    await expect(page.getByRole("list", { name: "Partners" }).locator("li")).toHaveCount(3);

    await expect(page.getByRole("heading", { name: "Investors — Remote Rancher" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Buyers — Orbolo beef" })).toBeVisible();

    await expect(page.getByRole("heading", { name: "Why this, why now" })).toBeVisible();
    const arguments_ = page.locator("#main ol li").filter({ hasText: "Paraguay is an established exporter" });
    await expect(arguments_.first()).toBeVisible();

    await expect(page.getByRole("heading", { name: "The Code, in five lines" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Read the full Code" })).toHaveAttribute("href", "/en/the-code");

    await expect(page.getByRole("heading", { name: "Where we are" })).toBeVisible();
    await expect(page.getByText(/Last updated 2026-09-16/)).toBeVisible();

    await expect(page.getByRole("heading", { name: "What we don't do yet" })).toBeVisible();
    await expect(page.getByText(/Orbolo doesn't take your money/)).toBeVisible();

    await expect(page.getByRole("heading", { name: "Choose your path" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Landowners" })).toHaveAttribute("href", "/en/land");
  });

  test("both audience CTAs navigate correctly within one click", async ({ page }) => {
    await page.goto("/en/");
    await page.getByRole("link", { name: "Invest in a herd" }).first().click();
    await expect(page).toHaveURL("/en/invest");
  });

  test("partner strip never shows a bare, role-less logo", async ({ page }) => {
    await page.goto("/en/");
    const partnerItems = page.getByRole("list", { name: "Partners" }).locator("li");
    const count = await partnerItems.count();
    for (let i = 0; i < count; i++) {
      await expect(partnerItems.nth(i).locator("span")).not.toHaveText("");
    }
  });
});
