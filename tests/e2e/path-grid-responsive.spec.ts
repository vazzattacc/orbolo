import { expect, test } from "@playwright/test";

const desktop = { width: 1280, height: 900 };
const tabletPortrait = { width: 834, height: 1194 };
const tabletLandscape = { width: 1194, height: 834 };
const mobile = { width: 390, height: 844 };

async function columnCount(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const grid = document.querySelector(".path-grid");
    if (!grid) return 0;
    const style = getComputedStyle(grid);
    return style.gridTemplateColumns.split(" ").length;
  });
}

// quickstart.md Scenario 9 — FR-012, FR-013
test("desktop shows a 3-column grid, not a scaled clone of a single-column layout", async ({ page }) => {
  await page.setViewportSize(desktop);
  await page.goto("/");
  await page.locator("[data-path-card]").first().scrollIntoViewIfNeeded();
  expect(await columnCount(page)).toBe(3);
});

test("mobile shows a single-column layout with comfortable touch targets", async ({ page }) => {
  await page.setViewportSize(mobile);
  await page.goto("/");
  const card = page.locator("[data-path-card]").first();
  await card.scrollIntoViewIfNeeded();
  expect(await columnCount(page)).toBe(1);

  const trigger = card.locator("[data-path-card-trigger]");
  const box = await trigger.boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);

  // flip interaction remains comfortable at this size
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(card.locator("[data-path-card-discover]")).toBeVisible();
});

test("tablet layout readjusts across a portrait -> landscape rotation", async ({ page }) => {
  await page.setViewportSize(tabletPortrait);
  await page.goto("/");
  await page.locator("[data-path-card]").first().scrollIntoViewIfNeeded();
  const portraitColumns = await columnCount(page);

  await page.setViewportSize(tabletLandscape);
  await page.waitForTimeout(100);
  const landscapeColumns = await columnCount(page);

  expect(portraitColumns).toBeGreaterThanOrEqual(1);
  expect(landscapeColumns).toBeGreaterThanOrEqual(portraitColumns);

  // flip interaction and focus states survive the rotation
  const trigger = page.locator("[data-path-card-trigger]").first();
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
});
