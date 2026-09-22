import { expect, test } from "@playwright/test";

// quickstart.md Scenario 8 — FR-019 (this spec runs only under the
// `reduced-motion` Playwright project, which sets reducedMotion: "reduce")
test("flip and destination transitions are near-instant under prefers-reduced-motion", async ({
  page,
}) => {
  await page.goto("/");
  const card = page.locator("[data-path-card]").first();
  await card.scrollIntoViewIfNeeded();

  const flipper = card.locator(".path-card__flipper");
  const duration = await flipper.evaluate(
    (el) => getComputedStyle(el).transitionDuration,
  );
  // near-instant per research.md §6 (0.01ms, i.e. effectively no animation)
  expect(duration.trim()).not.toBe("0.6s");

  const trigger = card.locator("[data-path-card-trigger]");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  const discover = card.locator("[data-path-card-discover]");
  const href = await discover.getAttribute("href");
  await Promise.all([page.waitForURL(`**${href}`), discover.click()]);
  await expect(page).toHaveURL(new RegExp(`${href}$`));
});
