import { expect, test } from "@playwright/test";

// quickstart.md Scenario 6 — FR-009, FR-016, User Story 2 acceptance scenarios 1-2
test("keyboard-only: Tab + Enter opens a card and moves focus to Discover more, Enter navigates", async ({
  page,
}) => {
  await page.goto("/");

  const firstTrigger = page.locator("[data-path-card-trigger]").first();
  await firstTrigger.focus();
  await expect(firstTrigger).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(firstTrigger).toHaveAttribute("aria-expanded", "true");

  const discover = page.locator("[data-path-card-discover]").first();
  await expect(discover).toBeFocused();

  const href = await discover.getAttribute("href");
  await Promise.all([page.waitForURL(`**${href}`), page.keyboard.press("Enter")]);
  await expect(page).toHaveURL(new RegExp(`${href}$`));
});

test("keyboard-only: Escape flips a card back and returns focus to its trigger", async ({ page }) => {
  await page.goto("/");

  const firstTrigger = page.locator("[data-path-card-trigger]").first();
  await firstTrigger.focus();
  await page.keyboard.press("Enter");
  await expect(firstTrigger).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("Escape");
  await expect(firstTrigger).toHaveAttribute("aria-expanded", "false");
  await expect(firstTrigger).toBeFocused();
});
