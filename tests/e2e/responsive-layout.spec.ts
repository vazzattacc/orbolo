import { test, expect } from "@playwright/test";

test.describe("Responsive layout (User Story 3)", () => {
  test.beforeEach(async ({ isMobile }) => {
    test.skip(isMobile, "Viewport resizing is exercised once, against the desktop project");
  });

  async function columnCount(page: import("@playwright/test").Page) {
    const cards = page.getByRole("list").getByRole("link");
    const count = await cards.count();
    const tops: number[] = [];
    for (let i = 0; i < count; i++) {
      const box = await cards.nth(i).boundingBox();
      if (box) tops.push(box.y);
    }
    // Cluster row-tops within a sub-pixel-rendering tolerance, rather than
    // exact equality, so minor layout jitter doesn't register as a new row.
    const ROW_TOLERANCE_PX = 10;
    const rows: number[] = [];
    for (const y of tops) {
      if (!rows.some((rowTop) => Math.abs(rowTop - y) <= ROW_TOLERANCE_PX)) {
        rows.push(y);
      }
    }
    return Math.round(count / rows.length);
  }

  test("desktop layout uses a multi-column grid", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    expect(await columnCount(page)).toBeGreaterThan(1);
  });

  test("mobile layout stacks to a single column with adequate touch targets", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    expect(await columnCount(page)).toBe(1);

    const firstCardBox = await page.getByRole("list").getByRole("link").first().boundingBox();
    expect(firstCardBox?.height ?? 0).toBeGreaterThanOrEqual(44);
    expect(firstCardBox?.width ?? 0).toBeGreaterThanOrEqual(44);
  });

  test("tablet layout adapts and survives a portrait-to-landscape rotation", async ({ page }) => {
    await page.setViewportSize({ width: 834, height: 1194 });
    await page.goto("/");
    const portraitColumns = await columnCount(page);
    expect(portraitColumns).toBeGreaterThanOrEqual(1);

    await page.setViewportSize({ width: 1194, height: 834 });
    await expect(page.getByRole("list").getByRole("link")).toHaveCount(4);
    const landscapeColumns = await columnCount(page);
    expect(landscapeColumns).toBeGreaterThanOrEqual(portraitColumns);
  });
});
