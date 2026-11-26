import { expect, test } from "@playwright/test";

// specs/005-contact-form — FR-IMG-TEST-002 (quickstart.md scenario 16):
// loading priority (FR-IMG-007) and responsive delivery (FR-IMG-006), as
// markup. The byte budgets are checked on the production build
// (photo-budget-production.spec.ts).
const PAGES = [
  "/",
  "/invest",
  "/beef",
  "/land",
  "/about",
  "/contact",
  "/es",
  "/es/invest",
  "/es/beef",
  "/es/land",
  "/es/about",
  "/es/contact",
];
const REPLACEMENTS = ["pasture-herd", "calves-sky", "corral-cow", "cows-bells", "cow-grazing"];

for (const route of PAGES) {
  test(`${route}: the hero is the only high-priority image and is never lazy; every other photo is lazy`, async ({
    page,
  }) => {
    await page.goto(route);

    const high = page.locator('[fetchpriority="high"]');
    await expect(high).toHaveCount(1);
    expect(await high.evaluate((el) => el.matches(".phero__media img"))).toBe(true);
    await expect(page.locator(".phero__media img")).not.toHaveAttribute("loading", /.*/);

    // "low" is for images that are above the fold but hidden; "auto" is the same as leaving it out
    await expect(page.locator('[fetchpriority="low"], [fetchpriority="auto"]')).toHaveCount(0);
    await expect(page.locator('link[rel="preload"][as="image"]')).toHaveCount(0);

    for (const img of await page
      .locator(".band img, .split__media img, .split__sketch, .cta__collage img")
      .all()) {
      await expect(img).toHaveAttribute("loading", "lazy");
      await expect(img).not.toHaveAttribute("fetchpriority", /.*/);
    }
    // no photo is a CSS background
    for (const shell of await page
      .locator(".phero__media, .band, .split__media, .cta__collage")
      .all()) {
      expect(await shell.evaluate((el) => getComputedStyle(el).backgroundImage)).toBe("none");
    }
  });
}

for (const route of ["/", "/invest", "/beef", "/land", "/about"]) {
  test(`${route}: replaced photos offer AVIF then WebP, in several widths, with sizes and reserved dimensions`, async ({
    page,
  }) => {
    await page.goto(route);
    const pictures = await page.locator("picture:has(img[data-photo])").all();
    expect(pictures.length).toBeGreaterThan(0);

    for (const picture of pictures) {
      const name = await picture.locator("img").getAttribute("data-photo");
      expect(REPLACEMENTS).toContain(name);

      const sources = await picture.locator("source").evaluateAll((els) =>
        els.map((s) => ({
          type: s.getAttribute("type"),
          media: s.getAttribute("media"),
          srcset: s.getAttribute("srcset") ?? "",
          sizes: s.getAttribute("sizes"),
        })),
      );
      // within each frame (same media), AVIF comes before WebP
      for (const media of new Set(sources.map((s) => s.media))) {
        const types = sources.filter((s) => s.media === media).map((s) => s.type);
        expect(types.indexOf("image/avif"), `${name}: AVIF source`).toBeGreaterThanOrEqual(0);
        expect(types.indexOf("image/webp"), `${name}: WebP after AVIF`).toBeGreaterThan(
          types.indexOf("image/avif"),
        );
      }
      // the portrait frame, when there is one, is offered before the wide frame
      const firstDefault = sources.findIndex((s) => !s.media);
      expect(
        sources.slice(firstDefault).every((s) => !s.media),
        `${name}: portrait sources come first`,
      ).toBe(true);

      for (const source of sources) {
        const widths = [...source.srcset.matchAll(/ (\d+)w/g)].map((m) => Number(m[1]));
        expect(widths.length, `${name}: several widths`).toBeGreaterThanOrEqual(2);
        expect(Math.max(...widths), `${name}: nothing wider than 2560px`).toBeLessThanOrEqual(2560);
        expect(source.sizes, `${name}: sizes`).toBeTruthy();
      }

      const img = picture.locator("img");
      for (const attribute of ["src", "srcset", "sizes", "width", "height"]) {
        await expect(img, `${name}: ${attribute}`).toHaveAttribute(attribute, /.+/);
      }
      await expect(img).toHaveAttribute("decoding", "async");
    }
  });
}

test("portrait phones are offered the tall frame of a hero; landscape screens the wide one", async ({
  browser,
}) => {
  for (const [viewport, portrait] of [
    [{ width: 390, height: 844 }, true],
    [{ width: 1440, height: 900 }, false],
  ] as const) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.goto("/");
    const img = page.locator(".phero__media img");
    await expect.poll(() => img.evaluate((el) => (el as HTMLImageElement).complete)).toBe(true);
    const { width, height } = await img.evaluate(async (el) => {
      const bitmap = await createImageBitmap(
        await (await fetch((el as HTMLImageElement).currentSrc)).blob(),
      );
      return { width: bitmap.width, height: bitmap.height };
    });
    expect(height > width, `${viewport.width}px wide: ${width}×${height}`).toBe(portrait);
    await context.close();
  }
});

// SC-010, "layout shift from images is 0": the page is laid out the same
// whether or not a single photo has loaded, because every photo fills a box
// whose size comes from CSS. (The page's total layout-shift score is not used
// here: the web fonts swapping in move text by a hair, which is not an image
// shift and predates this feature.)
for (const route of ["/", "/invest", "/beef", "/land", "/about"]) {
  test(`${route}: the layout is identical with and without the photos loaded`, async ({
    browser,
  }) => {
    const measure = async (blockImages: boolean) => {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      if (blockImages) {
        await page.route(/\/_image|\/_astro\/.*\.(avif|webp|jpe?g)|\/images\/site\//, (r) =>
          r.abort(),
        );
      }
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < height; y += 600) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        await page.waitForTimeout(60);
      }
      if (!blockImages) await page.waitForLoadState("networkidle");
      await page.evaluate(() => window.scrollTo(0, 0));
      const boxes = await page.evaluate(() =>
        [
          ...document.querySelectorAll(
            "main > *, main section, .phero__media, .split__media, .band__bg, .cta__collage > *, img[data-photo]",
          ),
        ].map((el) => {
          const r = el.getBoundingClientRect();
          return [
            Math.round(r.left),
            Math.round(r.top + window.scrollY),
            Math.round(r.width),
            Math.round(r.height),
          ].join(",");
        }),
      );
      const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      await context.close();
      return { boxes, scrollHeight };
    };

    const without = await measure(true);
    const withPhotos = await measure(false);
    expect(withPhotos.scrollHeight).toBe(without.scrollHeight);
    expect(withPhotos.boxes).toEqual(without.boxes);
  });
}

// FR-IMG-007 as behaviour: the browser asks for the hero photo at high
// priority, and for no other image at high priority. (Chrome's Largest
// Contentful Paint metric ignores images that cover the whole viewport, so
// the metric itself cannot be used to identify the hero photo.)
for (const route of ["/", "/invest", "/beef"]) {
  test(`${route}: the hero photo is requested at high priority, and no other image is`, async ({
    page,
  }) => {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Network.enable");
    const images: Array<{ url: string; priority: string }> = [];
    cdp.on("Network.requestWillBeSent", (event) => {
      if (event.type === "Image")
        images.push({ url: event.request.url, priority: event.request.initialPriority });
    });

    await page.goto(route);
    const hero = page.locator(".phero__media img");
    await expect.poll(() => hero.evaluate((el) => (el as HTMLImageElement).complete)).toBe(true);
    const heroUrl = await hero.evaluate((el) => (el as HTMLImageElement).currentSrc);

    const high = images.filter(
      (image) => image.priority === "High" || image.priority === "VeryHigh",
    );
    expect(high.map((image) => image.url)).toEqual([heroUrl]);
  });
}
