import { expect, test, type Page } from "@playwright/test";

// specs/005-contact-form — FR-IMG-TEST-001 (quickstart.md scenario 15):
// the seven slots of FR-IMG-001 show their replacement, and every placement
// of a kept photo (FR-IMG-002) still shows the same file. Photos are
// identified by data-photo, never by URL: image URLs differ between
// `astro dev` and the build (contracts/photo-delivery-ui.md §2).
const SIZES = [
  { name: "390", width: 390, height: 844 },
  { name: "1440", width: 1440, height: 900 },
];
const LOCALES = [
  { name: "en", prefix: "" },
  { name: "es", prefix: "/es" },
];
const REPLACEMENTS = ["pasture-herd", "calves-sky", "corral-cow", "cows-bells", "cow-grazing"];

// page → slot selector → the photo it must show (data-model.md §7)
const REPLACED: Array<{ route: string; slot: string; selector: string; photo: string }> = [
  { route: "/", slot: "Home hero", selector: ".phero__media img", photo: "pasture-herd" },
  { route: "/invest", slot: "Invest hero", selector: ".phero__media img", photo: "calves-sky" },
  { route: "/beef", slot: "Beef hero", selector: ".phero__media img", photo: "corral-cow" },
  {
    route: "/beef",
    slot: "Beef: What we sell today",
    selector: 'section[aria-labelledby="what-we-sell-heading"] .split__media img',
    photo: "cows-bells",
  },
  {
    route: "/land",
    slot: "Land: Ganadería a Pasto",
    selector: 'section[aria-labelledby="gapp-heading"] .split__media img',
    photo: "cow-grazing",
  },
  {
    route: "/about",
    slot: "About: Why Paraguay",
    selector: 'section[aria-labelledby="about-paraguay-heading"] .band__bg img',
    photo: "cow-grazing",
  },
  {
    route: "/beef",
    slot: "Beef closing collage, 2nd image",
    selector: ".cta__collage .c2 img",
    photo: "cow-grazing",
  },
];

// page → every kept placement, as selector → file in public/images/site/
const KEPT: Array<{ route: string; localized: boolean; placements: Array<[string, string]> }> = [
  {
    route: "/land",
    localized: true,
    placements: [
      [".phero__media img", "orbolo-palms.jpg"],
      [".cta__collage .c1", "orbolo-cattle-shade.jpg"],
      [".cta__collage .c2", "florian.jpg"],
      [".cta__collage .c3", "orbolo-walk.jpg"],
      [".split__sketch", "cow-lines-lime.png"],
    ],
  },
  {
    route: "/about",
    localized: true,
    placements: [
      [".phero__media img", "shade-tree.jpg"],
      [".split__media img", "florian.jpg"],
      [".cta__collage .c1", "orbolo-cattle-shade.jpg"],
      [".cta__collage .c2", "orbolo-gauchos.jpg"],
      [".cta__collage .c3", "orbolo-walk.jpg"],
    ],
  },
  { route: "/contact", localized: true, placements: [[".phero__media img", "brahman-four.jpg"]] },
  { route: "/404", localized: false, placements: [[".phero__media img", "orbolo-walk.jpg"]] },
  {
    route: "/invest",
    localized: true,
    placements: [
      ['section[aria-labelledby="what-you-own-heading"] .band__bg', "pasture-top.jpg"],
      ['.split__media img[data-photo="gaucho-nelore"]', "gaucho-nelore.jpg"],
      ['.split__media img[data-photo="grazing-bright"]', "grazing-bright.jpg"],
      [".cta__collage .c1", "orbolo-cattle-shade.jpg"],
      [".cta__collage .c2", "florian.jpg"],
      [".cta__collage .c3", "orbolo-walk.jpg"],
    ],
  },
  {
    route: "/beef",
    localized: true,
    placements: [
      ['section[aria-labelledby="first-pick-heading"] .band__bg', "nelore-herd.jpg"],
      ['.split__media img[data-photo="shade-tree"]', "shade-tree.jpg"],
      [".cta__collage .c1", "orbolo-cattle-shade.jpg"],
      [".cta__collage .c3", "brahman-four.jpg"],
    ],
  },
];

async function decoded(page: Page, selector: string) {
  const img = page.locator(selector).first();
  // not scrollIntoViewIfNeeded(): it waits for the element to hold still, and the hero photo drifts forever
  await img.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await expect
    .poll(
      () =>
        img.evaluate(
          (el) => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0,
        ),
      {
        message: `${selector} has loaded and decoded`,
        timeout: 15_000,
      },
    )
    .toBe(true);
}

for (const size of SIZES) {
  for (const locale of LOCALES) {
    test.describe(`${locale.name} at ${size.name}px`, () => {
      test.use({ viewport: { width: size.width, height: size.height } });

      for (const slot of REPLACED) {
        test(`${slot.slot} shows ${slot.photo}`, async ({ page }) => {
          await page.goto(`${locale.prefix}${slot.route}`);
          const img = page.locator(slot.selector);
          await expect(img).toHaveCount(1);
          await expect(img).toHaveAttribute("data-photo", slot.photo);
          await decoded(page, slot.selector);
        });
      }

      for (const kept of KEPT) {
        if (!kept.localized && locale.prefix) continue;
        test(`${kept.route}: kept photos are the same files as before`, async ({ page }) => {
          await page.goto(`${locale.prefix}${kept.route}`);
          for (const [selector, file] of kept.placements) {
            const img = page.locator(selector);
            await expect(img, selector).toHaveCount(1);
            await expect(img, selector).toHaveAttribute("src", `/images/site/${file}`);
            // a kept photo is a plain <img>, never run through the image pipeline
            await expect(page.locator(`picture:has(${selector})`), selector).toHaveCount(0);
          }
        });
      }

      for (const route of ["/", "/invest", "/beef", "/land", "/about"]) {
        test(`${route}: no replacement photo appears twice on the page`, async ({ page }) => {
          await page.goto(`${locale.prefix}${route}`);
          const names = await page
            .locator("img[data-photo]")
            .evaluateAll((imgs) => imgs.map((i) => i.getAttribute("data-photo")));
          for (const photo of REPLACEMENTS) {
            expect(
              names.filter((n) => n === photo).length,
              `${photo} on ${route}`,
            ).toBeLessThanOrEqual(1);
          }
        });
      }
    });
  }
}

// FR-IMG-010 / FR-IMG-011: the two informative photos describe what they
// show, in the page's language, and claim nothing about Orbolo's own ranch.
const ALTS = [
  {
    route: "/beef",
    selector: 'section[aria-labelledby="what-we-sell-heading"] .split__media img',
    alt: "Brown cattle with bells, standing under a tree.",
  },
  {
    route: "/es/beef",
    selector: 'section[aria-labelledby="what-we-sell-heading"] .split__media img',
    alt: "Ganado marrón con cencerros bajo un árbol.",
  },
  {
    route: "/land",
    selector: 'section[aria-labelledby="gapp-heading"] .split__media img',
    alt: "A brown cow grazing on green pasture.",
  },
  {
    route: "/es/land",
    selector: 'section[aria-labelledby="gapp-heading"] .split__media img',
    alt: "Una vaca marrón pastando en un potrero verde.",
  },
];
for (const { route, selector, alt } of ALTS) {
  test(`${route}: the split photo's alt text describes the new photo`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator(selector)).toHaveAttribute("alt", alt);
    expect(alt).not.toMatch(/orbolo|tapir|paraguay|chaco/i);
  });
}

test("hero, band and collage photos stay decorative (empty alt)", async ({ page }) => {
  for (const route of ["/", "/invest", "/beef", "/about"]) {
    await page.goto(route);
    for (const img of await page
      .locator(".phero__media img, .band__bg img, img.band__bg, .cta__collage img")
      .all()) {
      await expect(img).toHaveAttribute("alt", "");
    }
  }
});
