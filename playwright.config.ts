import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
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
      // Mutates the shared lib/paths/paths.json content file, so it runs
      // alone, after every other project has finished, to avoid racing
      // concurrent requests to "/" against other tests' assumptions about
      // the steady-state published-path count.
      name: "cms-mutation",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /cms-friendliness\.spec\.ts/,
      dependencies: ["chromium", "mobile-chrome"],
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
