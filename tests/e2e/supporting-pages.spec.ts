import { test, expect } from "@playwright/test";

test.describe("Supporting pages (User Story 7)", () => {
  test("About shows story, group structure, where-we-are, and careers", async ({ page }) => {
    await page.goto("/en/about");
    await expect(page.getByRole("heading", { name: "Operators, not advisors." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Our story" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Group structure" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Where we are" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Careers" })).toBeVisible();
    await expect(page.getByText(/Orbolo does not collect investments/)).toBeVisible();
  });

  test("Orbolo Bridge shows education/site-visit/non-profit content", async ({ page }) => {
    await page.goto("/en/orbolo-bridge");
    await expect(page.getByRole("heading", { name: "Orbolo Bridge." })).toBeVisible();
    await expect(page.getByText(/site visits for organisations/).first()).toBeVisible();
  });

  test("Contact has all four routed forms plus a scheduling link", async ({ page }) => {
    await page.goto("/en/contact");
    await expect(page.locator("#form-investor")).toBeVisible();
    await expect(page.locator("#form-buyer")).toBeVisible();
    await expect(page.locator("#form-landowner")).toBeVisible();
    await expect(page.locator("#form-general")).toBeVisible();
    await expect(page.getByRole("link", { name: /Book a call/ })).toBeVisible();
  });
});
