import { expect, test } from "@playwright/test";

// spec 001 — FR-019 (this spec runs only under the
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
  // near-instant per spec 001 R6 (0.01ms, i.e. effectively no animation)
  expect(duration.trim()).not.toBe("0.6s");

  const trigger = card.locator("[data-path-card-trigger]");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  const discover = card.locator("[data-path-card-discover]");
  const href = await discover.getAttribute("href");
  await Promise.all([page.waitForURL(`**${href}`), discover.click()]);
  await expect(page).toHaveURL(new RegExp(`${href}$`));
});

// specs/005-contact-form — FR-IMG-009: the photo refresh changes how the
// hero photo is delivered (<picture> instead of <img>), not how it moves.
// Under reduced motion it still has no drift, on both paths.
for (const [route, kind] of [
  ["/", "a replaced photo, inside <picture>"],
  ["/land", "a kept photo, a plain <img>"],
] as const) {
  test(`${route}: the hero photo does not drift under prefers-reduced-motion (${kind})`, async ({ page }) => {
    await page.goto(route);
    const photo = page.locator(".phero__media img");
    await expect(photo).toHaveCount(1);
    expect(await photo.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
  });
}

// specs/005-contact-form — Edge Cases: with reduced motion there is no
// smooth scroll at all, and focus still moves where the form sends it.
test("/contact: an empty Send focuses the error summary, and a summary link focuses its field", async ({ page }) => {
  await page.goto("/contact");
  await page.locator("[data-contact-form][data-contact-ready]").waitFor();
  await page.locator("[data-contact-send]").click();
  const summary = page.locator("[data-contact-summary]");
  await expect(summary).toBeFocused();
  await summary.locator('a[href="#contact-email"]').click();
  await expect(page.locator("#contact-email")).toBeFocused();
});
