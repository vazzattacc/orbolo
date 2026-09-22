import { expect, test } from "@playwright/test";

// quickstart.md Scenario 10 — FR-022
test("a card whose image fails to load renders the branded fallback, card stays interactive", async ({
  page,
}) => {
  await page.route("**/images/paths/investors.jpg", (route) => route.abort("failed"));

  await page.goto("/");
  const card = page.locator("[data-path-card]").first();
  await card.scrollIntoViewIfNeeded();

  const imageWrap = card.locator(".path-card__image-wrap");
  await expect(imageWrap).toHaveClass(/path-card__image-wrap--fallback/);

  // Title/description and the flip/discover interaction remain intact.
  await expect(card.locator("h3").first()).toBeVisible();
  const trigger = card.locator("[data-path-card-trigger]");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(card.locator("[data-path-card-discover]")).toBeVisible();
});
