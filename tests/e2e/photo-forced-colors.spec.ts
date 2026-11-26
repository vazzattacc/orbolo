import { expect, test } from "@playwright/test";
import { measureTextContrast } from "./support/photo-contrast";

// specs/005-contact-form — FR-IMG-008 / US5-AS6 (quickstart.md scenario 19).
// Forced Colors Mode (Windows High Contrast) removes gradients and shadows,
// so the forest shade over photos is gone. Text over a photo must then sit
// on a solid system colour, and nothing may opt out of the user's colours.
test.use({ reducedMotion: "reduce", forcedColors: "active" });

const TEXT_BLOCKS = ".phero__title, .phero__side, .band__head, .band__foot";

for (const route of ["/", "/beef", "/about", "/contact"]) {
  test(`${route}: text over photos sits on a system colour in Forced Colors Mode`, async ({
    page,
  }) => {
    await page.goto(route);
    await page.locator("[data-split].is-ready").first().waitFor();

    const blocks = await page.locator(TEXT_BLOCKS).all();
    expect(blocks.length).toBeGreaterThan(0);
    for (const block of blocks) {
      const background = await block.evaluate((el) => getComputedStyle(el).backgroundColor);
      expect(background, "the text block has a solid background").not.toBe("rgba(0, 0, 0, 0)");
      expect(background).not.toMatch(/rgba\([^)]*, 0\)$/);
    }

    // FR-IMG-008: forced-color-adjust is never used to keep the photos' look
    const optedOut = await page.evaluate(
      () =>
        [...document.querySelectorAll("*")].filter(
          (el) => getComputedStyle(el).forcedColorAdjust === "none",
        ).length,
    );
    expect(optedOut).toBe(0);

    // every line over the photo, the nav's links included, is readable in the system colours
    const samples = await measureTextContrast(page);
    expect(samples.length).toBeGreaterThan(0);
    expect(samples.filter((sample) => sample.ratio < sample.required)).toEqual([]);
  });
}
