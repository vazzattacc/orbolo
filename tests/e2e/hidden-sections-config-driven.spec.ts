import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

// Proves the hide/show logic in contracts/nav-and-hidden-sections.md is
// genuinely conditional, not permanently disabled code — mirrors
// tests/e2e/path-card-config-driven.spec.ts's fixture-mutation pattern.
// Every section this suite exercises today has no real content, so this
// is the only way to test the "becomes visible" half of that contract.

const RANCHES_JSON = fileURLToPath(new URL("../../src/content/ranches/ranches.json", import.meta.url));
const INVEST_JSON = fileURLToPath(new URL("../../src/content/invest/invest.json", import.meta.url));
const BEEF_JSON = fileURLToPath(new URL("../../src/content/beef/beef.json", import.meta.url));

const originalRanches = readFileSync(RANCHES_JSON, "utf-8");
const originalInvest = readFileSync(INVEST_JSON, "utf-8");
const originalBeef = readFileSync(BEEF_JSON, "utf-8");

test.describe.configure({ mode: "serial" });

// Each test restores only the fixture(s) it actually touched, and waits for
// the page to fully settle before the next test starts — back-to-back
// content-watcher reloads across multiple files can otherwise stack up and
// leave the page mid-reload when the next test begins navigating.

test("Deployment Pipeline renders once a matching ranch exists (FR-INV-008)", async ({ page }) => {
  await page.goto("/invest");
  await expect(page.getByRole("heading", { name: "Deployment pipeline" })).toHaveCount(0);

  writeFileSync(
    RANCHES_JSON,
    JSON.stringify(
      [
        {
          id: "ranch-04",
          codename: "Ranch 04",
          region: "Presidente Hayes",
          hectares: 1200,
          grazingSystem: "Rotational holistic",
          yearsInTransition: 3,
          mpcsStatus: "member",
          checklistFlags: {
            mpcsMember: true,
            minYearsTransition: true,
            waterSecurity: true,
            deforestationFreeSatellite: true,
            contractInPlace: false,
          },
          threshold: 200,
          committedUnderLoi: 80,
          status: "Open for LOI",
          updatedDate: "2026-09-24",
        },
      ],
      null,
      2,
    ),
  );

  const invest = JSON.parse(originalInvest);
  invest[0].deploymentPipeline = { ranchSlugs: ["ranch-04"] };
  writeFileSync(INVEST_JSON, JSON.stringify(invest, null, 2));

  await expect(page.getByRole("heading", { name: "Deployment pipeline" })).toBeVisible({ timeout: 15_000 });
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("Ranch 04")).toBeVisible();
  await expect(page.getByText("80 / 200 committed")).toBeVisible();

  writeFileSync(RANCHES_JSON, originalRanches);
  writeFileSync(INVEST_JSON, originalInvest);
  await expect(page.getByRole("heading", { name: "Deployment pipeline" })).toHaveCount(0, { timeout: 15_000 });
  await page.waitForLoadState("networkidle");
});

test("Beef roadmap renders once a milestone exists (FR-BEEF-004)", async ({ page }) => {
  await page.goto("/beef");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("heading", { name: "Roadmap" })).toHaveCount(0);

  const beef = JSON.parse(originalBeef);
  beef[0].roadmap = {
    milestones: [{ stage: "Now", body: "Grass-fed beef under MPCS.", targetDate: "2026-09-24" }],
  };
  writeFileSync(BEEF_JSON, JSON.stringify(beef, null, 2));

  await expect(page.getByRole("heading", { name: "Roadmap" })).toBeVisible({ timeout: 15_000 });
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("Grass-fed beef under MPCS.")).toBeVisible();

  writeFileSync(BEEF_JSON, originalBeef);
  await expect(page.getByRole("heading", { name: "Roadmap" })).toHaveCount(0, { timeout: 15_000 });
});
