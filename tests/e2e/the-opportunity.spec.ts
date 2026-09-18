import { test, expect } from "@playwright/test";

test.describe("The Opportunity (User Story 5, FR-025)", () => {
  test("sourced arguments show a dated figure and a data room reference", async ({ page }) => {
    await page.goto("/en/the-opportunity");
    await expect(page.getByRole("heading", { name: "The Opportunity" })).toBeVisible();
    await expect(page.getByText("490,000")).toBeVisible();
    await expect(page.getByText(/As of 2026-01-15/)).toBeVisible();
    await expect(page.getByText(/Data room: 01 Group & legal/)).toBeVisible();
  });

  test("an unsourced argument is marked pending rather than showing a fabricated figure", async ({ page }) => {
    await page.goto("/en/the-opportunity");
    await expect(page.getByText("Figure pending publication.")).toBeVisible();
  });
});
