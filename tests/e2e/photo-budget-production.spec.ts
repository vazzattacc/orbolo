import { expect, test } from "@playwright/test";

// specs/005-contact-form — SC-009 / FR-IMG-TEST-002 (quickstart.md scenario
// 17). Runs only in the `production-build` project: what is measured is what
// ships. Conditions clarified 2026-11-14: a 390 px phone at 3× pixel density
// (≤ 200 KB per replaced photo) and a 1440 px screen at 1× and at 2×
// (≤ 450 KB). Pixel density decides which file the browser picks, so a 1×
// test alone would say nothing about real phones and laptops.
const KB = 1024;
const CONDITIONS = [
  {
    name: "390 px phone at 3×",
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    budget: 200 * KB,
  },
  {
    name: "1440 px screen at 1×",
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    budget: 450 * KB,
  },
  {
    name: "1440 px screen at 2×",
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    budget: 450 * KB,
  },
];
const PAGES: Array<{ route: string; photos: string[] }> = [
  { route: "/", photos: ["pasture-herd"] },
  { route: "/invest", photos: ["calves-sky"] },
  { route: "/beef", photos: ["corral-cow", "cows-bells", "cow-grazing"] },
  { route: "/land", photos: ["cow-grazing"] },
  { route: "/about", photos: ["cow-grazing"] },
];

for (const condition of CONDITIONS) {
  for (const { route, photos } of PAGES) {
    test(`${condition.name}: ${route} stays within ${condition.budget / KB} KB per replaced photo`, async ({
      browser,
      baseURL,
    }) => {
      const context = await browser.newContext({
        baseURL,
        viewport: condition.viewport,
        deviceScaleFactor: condition.deviceScaleFactor,
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      const responses = new Map<string, { size: number; type: string }>();
      page.on("response", async (response) => {
        if (response.request().resourceType() !== "image") return;
        try {
          responses.set(response.url(), {
            size: (await response.body()).length,
            type: response.headers()["content-type"] ?? "",
          });
        } catch {
          // a request cancelled by navigation has no body
        }
      });

      await page.goto(route);
      // scroll through the page so every lazy photo is requested
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y <= height; y += 500) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        await page.waitForTimeout(80);
      }
      await page.waitForLoadState("networkidle");

      for (const photo of photos) {
        // on small screens the collage shows only its middle image; hidden photos are never fetched
        const img = page.locator(`img[data-photo="${photo}"]`).first();
        await expect(img).toHaveCount(1);
        await expect
          .poll(() =>
            img.evaluate(
              (el) =>
                (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0,
            ),
          )
          .toBe(true);
        const picked = await img.evaluate(async (el) => {
          const url = (el as HTMLImageElement).currentSrc;
          const bitmap = await createImageBitmap(await (await fetch(url)).blob());
          return { url, width: bitmap.width, height: bitmap.height };
        });

        const response = responses.get(picked.url);
        expect(response, `${photo}: the chosen file was downloaded (${picked.url})`).toBeDefined();
        expect(response!.type, `${photo}: served as AVIF`).toBe("image/avif");
        expect(
          response!.size,
          `${photo}: ${Math.round(response!.size / KB)} KB at ${picked.width}×${picked.height}`,
        ).toBeLessThanOrEqual(condition.budget);
        expect(picked.width, `${photo}: never wider than 2560 px`).toBeLessThanOrEqual(2560);
      }

      // nothing the image pipeline serves is ever the size of a Pexels original (1–4 MB).
      // Kept photos in /images/site/ are out of scope: FR-IMG-002 keeps them byte-identical.
      for (const [url, { size }] of responses) {
        if (new URL(url).pathname.startsWith("/images/")) continue;
        expect(size, `${url} is under 1 MB`).toBeLessThan(1024 * KB);
      }
      // a portrait phone gets the portrait frame of a hero, not a desktop-sized file
      if (condition.viewport.width < 992 && ["/", "/invest", "/beef"].includes(route)) {
        const hero = await page.locator(".phero__media img").evaluate(async (el) => {
          const bitmap = await createImageBitmap(
            await (await fetch((el as HTMLImageElement).currentSrc)).blob(),
          );
          return { width: bitmap.width, height: bitmap.height };
        });
        expect(hero.height, "hero frame on a phone is portrait").toBeGreaterThan(hero.width);
        expect(hero.width).toBeLessThanOrEqual(1080);
      }
      await context.close();
    });
  }
}
