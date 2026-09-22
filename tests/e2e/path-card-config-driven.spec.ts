import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const PATHS_JSON = fileURLToPath(new URL("../../src/content/paths/paths.json", import.meta.url));
const original = readFileSync(PATHS_JSON, "utf-8");

// Both tests here mutate the shared paths.json fixture; run them serially
// so they never race each other (no other spec file touches this fixture),
// and never race Astro dev's own HMR-triggered reload of the page (which
// fires autonomously on a content change — an explicit page.reload() here
// would race that autonomous reload and intermittently land mid-navigation).
test.describe.configure({ mode: "serial" });

test.afterEach(() => {
  writeFileSync(PATHS_JSON, original);
});

// quickstart.md Scenario 5 — FR-008, FR-015: editing only the content
// configuration is reflected on reload, with zero PathCard/PathGrid code
// changes. This is an e2e test, not a Vitest unit test, because Astro
// Content Collections are a build/dev-sync-time data source (see
// tests/unit/path-repository.test.ts and scripts/warm-content-store.mjs) —
// getCollection() does not re-read the file live within a single process,
// but the running `astro dev` server's content watcher does re-sync on
// file change and pushes an HMR reload, which is exactly the "content
// owner edits JSON, the page updates" workflow the spec describes.
test("editing a card's title in paths.json is reflected on reload with no component changes", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Beef", exact: true }).first()).toBeVisible();

  const updated = JSON.parse(original);
  updated[1].title = "Beef (edited by test)";
  writeFileSync(PATHS_JSON, JSON.stringify(updated, null, 2));

  // No manual reload: Astro dev's content watcher pushes its own HMR
  // reload once it re-syncs — this just waits for that to land.
  await expect(page.getByRole("heading", { name: "Beef (edited by test)" }).first()).toBeVisible({
    timeout: 15_000,
  });
});

// User Story 4 acceptance scenario 2 — a 4th card, added purely via
// configuration, renders correctly alongside the existing three, flip
// interaction included, with no component code changes.
test("a 4th card added purely via configuration renders and flips correctly", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator("[data-path-card]");
  await expect(cards).toHaveCount(3);

  const updated = JSON.parse(original);
  updated.push({
    id: "partners",
    title: "Partners",
    description: "A fourth audience path added purely through configuration, for this test.",
    image: { src: "/images/paths/investors.jpg", alt: "Placeholder test image." },
    destination: "/partners",
    targetAudience: "Partners",
    order: 4,
  });
  writeFileSync(PATHS_JSON, JSON.stringify(updated, null, 2));

  await expect(cards).toHaveCount(4, { timeout: 15_000 });
  // Content-layer changes can trigger more than one HMR reload in close
  // succession; let the page fully settle before interacting further.
  await page.waitForLoadState("networkidle");
  await expect(cards).toHaveCount(4);

  const fourth = cards.last();
  await fourth.scrollIntoViewIfNeeded();
  const trigger = fourth.locator("[data-path-card-trigger]");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(fourth.locator("[data-path-card-discover]")).toHaveAttribute("href", "/partners");
});
