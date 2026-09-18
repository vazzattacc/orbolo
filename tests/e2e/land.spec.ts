import { test, expect } from "@playwright/test";

test.describe("Land (User Story 4)", () => {
  test("El Tapir is named, not anonymised, and marked open by appointment", async ({ page }) => {
    await page.goto("/en/land");
    await expect(page.getByRole("heading", { name: "El Tapir" })).toBeVisible();
    await expect(page.getByText(/open to visitors by appointment/)).toBeVisible();
  });

  test("partner ranch cards show no owner name or exact location without consent", async ({ page }) => {
    await page.goto("/en/land");
    const card = page.locator("article[data-ranch-status]").first();
    await expect(card).toContainText("Ranch 04"); // codename, not an exact owner name
    const cardText = await card.textContent();
    expect(cardText).not.toContain("Estancia"); // no fabricated exact-name leak
  });

  test("Ganadería a Pasto is framed as how the group grows supply", async ({ page }) => {
    await page.goto("/en/land");
    await expect(page.getByText(/how the group grows its supply/)).toBeVisible();
  });

  test("'Work with us' form is present for landowners", async ({ page }) => {
    await page.goto("/en/land");
    await expect(page.locator("#form-landowner")).toBeVisible();
  });
});
