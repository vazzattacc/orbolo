import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { measureTextContrast, type ContrastSample } from "./support/photo-contrast";

// specs/005-contact-form — FR-IMG-008 / FR-IMG-TEST-003 / SC-011
// (quickstart.md scenarios 18 and 22). Every line of text over a photo meets
// WCAG 2.2 AA: 4.5:1, or 3:1 for large text. Measured twice per page: over
// the real photo, and over a pure white photo, which proves the shade alone
// carries the contrast whatever the photo (research.md §23).
//
// All seven hero pages are covered (clarified 2026-11-14): Contact and 404
// share the PhotoHero shell, so their shade changed too.
test.use({ reducedMotion: "reduce" });

const PAGES = [
  "/",
  "/invest",
  "/beef",
  "/land",
  "/about",
  "/contact",
  "/404",
  "/es",
  "/es/invest",
  "/es/beef",
  "/es/land",
  "/es/about",
  "/es/contact",
];
const SIZES = [
  { name: "390", width: 390, height: 844 },
  { name: "1440", width: 1440, height: 900 },
];

function failures(samples: ContrastSample[]) {
  return samples.filter((sample) => sample.ratio < sample.required);
}

for (const size of SIZES) {
  test.describe(`at ${size.name}px`, () => {
    test.use({ viewport: { width: size.width, height: size.height } });

    for (const route of PAGES) {
      test(`${route}: text over photos passes AA, over the real photo and over white`, async ({
        page,
      }, testInfo) => {
        await page.goto(route);
        await page.locator("[data-split].is-ready").first().waitFor();

        const real = await measureTextContrast(page);
        const white = await measureTextContrast(page, { whitePhotos: true });
        expect(real.length, "text over photos was found and measured").toBeGreaterThan(0);

        // FR-IMG-TEST-003: the results travel with the change
        await testInfo.attach(`contrast${route.replace(/\//g, "-")}-${size.name}.json`, {
          body: JSON.stringify({ route, width: size.width, real, white }, null, 2),
          contentType: "application/json",
        });

        expect(failures(real), "lines failing AA over the real photo").toEqual([]);
        expect(failures(white), "lines failing AA over a white photo").toEqual([]);
      });
    }
  });
}

// Automated accessibility checks on the five photo pages (SC-011). axe cannot
// see text over images, which is what the sampler above is for; it guards
// everything else. Colour contrast over photos is therefore left to the sampler.
for (const route of [
  "/",
  "/invest",
  "/beef",
  "/land",
  "/about",
  "/es",
  "/es/invest",
  "/es/beef",
  "/es/land",
  "/es/about",
]) {
  test(`${route}: axe reports no WCAG 2.2 AA violations`, async ({ page }) => {
    await page.goto(route);
    await page.locator("[data-split].is-ready").first().waitFor();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations.map(
        (v) => `${v.id}: ${v.nodes.length} node(s), e.g. ${v.nodes[0]?.html.slice(0, 120)}`,
      ),
    ).toEqual([]);
  });
}
