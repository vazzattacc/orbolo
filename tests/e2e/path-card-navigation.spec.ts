import { expect, test } from "@playwright/test";

// quickstart.md Scenario 4 — FR-006, FR-023, FR-024
test("activating Discover more navigates to the internal destination; Back returns home", async ({
  page,
}) => {
  await page.goto("/");
  const card = page.locator("[data-path-card]").first();
  await card.scrollIntoViewIfNeeded();

  const discover = card.locator("[data-path-card-discover]");
  const href = await discover.getAttribute("href");
  expect(href).toMatch(/^\//); // internal route only, never an external redirect

  await card.locator("[data-path-card-trigger]").click();
  await Promise.all([page.waitForURL(`**${href}`), discover.click()]);
  await expect(page).toHaveURL(new RegExp(`${href}$`));

  await Promise.all([page.waitForURL("**/"), page.goBack()]);
  await expect(page).toHaveURL(/\/$/);
});

// FR-024 — "Discover more" is a real anchor, present and reachable even
// without the flip having been triggered via JS.
test("Discover more is a real anchor present in the DOM before any flip interaction", async ({
  page,
}) => {
  await page.goto("/");
  const discover = page.locator("[data-path-card-discover]").first();
  await expect(discover).toHaveAttribute("href", /^\//);
  expect(await discover.evaluate((el) => el.tagName)).toBe("A");
});
