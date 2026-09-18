import { test, expect } from "@playwright/test";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CONTENT_DIR = join(import.meta.dirname, "../../src/content");
const METRIC_FILE = join(CONTENT_DIR, "metrics/remote-rancher-metric-1.json");
const LOI_FILE = join(CONTENT_DIR, "lois/loi-cms-test.json");

test.describe("CMS-friendliness (User Story 6)", () => {
  test.setTimeout(60_000);

  test("adding a sourced Metric makes it appear on Home with zero component changes", async ({ page }) => {
    expect(existsSync(METRIC_FILE)).toBe(false); // currently pending, per spec.md Assumptions

    try {
      writeFileSync(
        METRIC_FILE,
        JSON.stringify(
          {
            key: "remote-rancher-metric-1",
            label: "Ranches in the pipeline",
            value: "1",
            asOfDate: "2026-09-17",
            source: "Internal pipeline count (CMS-friendliness test fixture)",
          },
          null,
          2,
        ),
      );

      await expect(async () => {
        await page.goto("/en/", { waitUntil: "networkidle" });
        await expect(page.getByText("Ranches in the pipeline")).toBeVisible();
      }).toPass({ timeout: 15_000 });
    } finally {
      rmSync(METRIC_FILE, { force: true });
    }

    // Confirm it's gone again after removing the fixture (omit-if-missing).
    await expect(async () => {
      await page.goto("/en/", { waitUntil: "networkidle" });
      await expect(page.getByText("Ranches in the pipeline")).toHaveCount(0);
    }).toPass({ timeout: 15_000 });
  });

  test("updating Ranch 04's LOI data changes the pipeline's committed count with zero component changes", async ({ page }) => {
    await page.goto("/en/invest", { waitUntil: "networkidle" });
    await expect(page.getByText("Committed under LOI: 260 / 400 head")).toBeVisible();

    try {
      writeFileSync(
        LOI_FILE,
        JSON.stringify(
          {
            id: "loi-cms-test",
            ranch: "Ranch 04",
            signerEmail: "cms-test@example.com",
            headCount: 40,
            signedDate: "2026-09-16",
            converted: false,
          },
          null,
          2,
        ),
      );

      await expect(async () => {
        await page.goto("/en/invest", { waitUntil: "networkidle" });
        await expect(page.getByText("Committed under LOI: 300 / 400 head")).toBeVisible();
      }).toPass({ timeout: 15_000 });
    } finally {
      rmSync(LOI_FILE, { force: true });
    }

    await expect(async () => {
      await page.goto("/en/invest", { waitUntil: "networkidle" });
      await expect(page.getByText("Committed under LOI: 260 / 400 head")).toBeVisible();
    }).toPass({ timeout: 15_000 });
  });
});
