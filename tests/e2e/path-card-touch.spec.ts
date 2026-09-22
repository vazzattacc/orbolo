import { expect, test } from "@playwright/test";

// quickstart.md Scenario 7 — FR-009, FR-011 (mobile-chrome project provides touch emulation)
test("touch: tapping a card flips it open without hover, tapping Discover more navigates", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "touch-specific scenario runs under the mobile-chrome project");

  await page.goto("/");
  const card = page.locator("[data-path-card]").first();
  await card.scrollIntoViewIfNeeded();

  const trigger = card.locator("[data-path-card-trigger]");
  await trigger.tap();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  const discover = card.locator("[data-path-card-discover]");
  const href = await discover.getAttribute("href");
  await Promise.all([page.waitForURL(`**${href}`), discover.tap()]);
  await expect(page).toHaveURL(new RegExp(`${href}$`));
});
