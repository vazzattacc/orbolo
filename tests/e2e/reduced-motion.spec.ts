import { test, expect } from "@playwright/test";

test.describe("Reduced motion (User Story 2)", () => {
  test("transition/hover-scale animation collapses to near-zero duration when reduce-motion is enabled", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const underline = page.getByTestId("path-card-underline").first();
    const transitionDuration = await underline.evaluate((el) => getComputedStyle(el).transitionDuration);

    // Our global CSS forces transition-duration to ~0 under
    // prefers-reduced-motion (app/globals.css), rather than merely slowing it.
    const seconds = transitionDuration
      .split(",")
      .map((v) => parseFloat(v))
      .every((v) => v <= 0.001);
    expect(seconds).toBe(true);
  });

  test("without reduce-motion, the same element has a non-trivial transition duration", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");

    const underline = page.getByTestId("path-card-underline").first();
    const transitionDuration = await underline.evaluate((el) => getComputedStyle(el).transitionDuration);
    const hasRealTransition = transitionDuration
      .split(",")
      .some((v) => parseFloat(v) > 0.05);
    expect(hasRealTransition).toBe(true);
  });
});
