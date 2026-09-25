import { expect, test } from "@playwright/test";

// SC-002, SC-003, SC-004 — FR-GEN-003, FR-GEN-005, FR-BEEF-010.

const PAGES = ["/invest", "/beef", "/land"];

// §B2.6 banned-word list (spec.md FR-GEN-003). "premium" is excluded here —
// it's only banned as a price claim, which needs contextual judgement a
// plain substring scan can't make; the other 11 are unconditional.
const BANNED_WORDS = [
  "sustainable",
  "holistic",
  "impact",
  "journey",
  "solution",
  "ecosystem",
  "unlock",
  "seamless",
  "leverage",
  "empower",
  "passionate",
];

for (const path of PAGES) {
  test(`${path}: zero banned words (§B2.6)`, async ({ page }) => {
    await page.goto(path);
    const bodyText = (await page.locator("body").innerText()).toLowerCase();
    for (const word of BANNED_WORDS) {
      expect(bodyText, `"${word}" should not appear on ${path}`).not.toContain(word);
    }
  });

  test(`${path}: never "regenerative" or "guaranteed"`, async ({ page }) => {
    await page.goto(path);
    const bodyText = (await page.locator("body").innerText()).toLowerCase();
    expect(bodyText).not.toContain("regenerative");
    expect(bodyText).not.toContain("guaranteed");
  });

  test(`${path}: never describes Orbolo as collecting/managing investor capital`, async ({ page }) => {
    await page.goto(path);
    const bodyText = (await page.locator("body").innerText()).toLowerCase();
    expect(bodyText).not.toContain("invest with orbolo");
  });
}

test("every rendered metric value carries a visible date and source (SC-004)", async ({ page }) => {
  // Today's only rendered metrics are on Invest and Land (El Tapir hectares,
  // animal count, GAPP hectares) — each via MetricValue.astro, which always
  // renders an "(as of <date>)" span alongside the value.
  for (const path of ["/invest", "/land"]) {
    await page.goto(path);
    const dateNotes = page.locator("text=/as of 2026-09-2\\d/");
    expect(await dateNotes.count()).toBeGreaterThan(0);
  }
});
