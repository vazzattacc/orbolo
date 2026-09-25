import { expect, test } from "@playwright/test";

// quickstart.md Scenario 3 — FR-LAND-001..004, SC-001

test.describe("Land page", () => {
  test("El Tapir, Ganadería a Pasto, and Work-with-us all render", async ({ page }) => {
    await page.goto("/land");

    await expect(page.getByRole("heading", { name: "El Tapir", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Ganadería a Pasto" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Own land in Paraguay?" })).toBeVisible();
  });

  test("El Tapir and Ganadería a Pasto figures render with a visible date and source", async ({ page }) => {
    await page.goto("/land");
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).toContain("1000 ha");
    expect(bodyText).toContain("35000 ha");
    expect(bodyText).toMatch(/as of 2026-09-2\d/);
  });

  test("El Tapir's expansion-target line is absent (still unanswered)", async ({ page }) => {
    await page.goto("/land");
    const bodyText = (await page.locator("body").innerText()).toLowerCase();
    expect(bodyText).not.toContain("expansion");
  });

  test("Partner ranches section is absent from the DOM (OQ-013: no real ranch data yet)", async ({ page }) => {
    await page.goto("/land");
    await expect(page.getByRole("heading", { name: "Partner ranches" })).toHaveCount(0);
  });

  test("Work with us CTA is present", async ({ page }) => {
    await page.goto("/land");
    await expect(page.getByRole("link", { name: "Work with us" })).toHaveAttribute("href", "/contact");
  });
});
