import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4321",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: /cms-friendliness\.spec\.ts/,
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
      testIgnore: /cms-friendliness\.spec\.ts/,
    },
    {
      // Mutates real content files (and restores them afterwards) — runs
      // alone, after every other project finishes, so no other test races
      // it while content is being rewritten (mirrors 001's cms-mutation setup).
      name: "cms-mutation",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /cms-friendliness\.spec\.ts/,
      dependencies: ["chromium", "mobile-chrome"],
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
