import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.locator("[data-path-card]").first().scrollIntoViewIfNeeded();
});

// quickstart.md Scenario 2 — FR-004
test("clicking a card's front face flips it open, revealing description and Discover more", async ({
  page,
}) => {
  const card = page.locator("[data-path-card]").first();
  const trigger = card.locator("[data-path-card-trigger]");
  const discover = card.locator("[data-path-card-discover]");

  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();

  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(discover).toBeVisible();
  await expect(discover).toHaveText("Discover more");

  // The flip itself must not navigate.
  await expect(page).toHaveURL(/\/$/);
});

// quickstart.md Scenario 3 — FR-005
test("clicking a flipped card anywhere other than Discover more flips it back", async ({ page }) => {
  const card = page.locator("[data-path-card]").first();
  const trigger = card.locator("[data-path-card-trigger]");
  const back = card.locator("[data-path-card-back]");

  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  await back.click({ position: { x: 10, y: 10 } });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("clicking the explicit Back control flips a flipped card back", async ({ page }) => {
  const card = page.locator("[data-path-card]").first();
  const trigger = card.locator("[data-path-card-trigger]");
  const close = card.locator("[data-path-card-close]");

  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  await close.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});
