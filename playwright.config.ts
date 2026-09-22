import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:4321",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: [/reduced-motion\.spec\.ts/, /path-card-config-driven\.spec\.ts/],
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
      testIgnore: [/reduced-motion\.spec\.ts/, /path-card-config-driven\.spec\.ts/],
    },
    {
      name: "reduced-motion",
      use: { ...devices["Desktop Chrome"], reducedMotion: "reduce" },
      testMatch: /reduced-motion\.spec\.ts/,
    },
    {
      // Mutates the shared src/content/paths/paths.json fixture, whose
      // changes trigger Astro dev's content-watcher to hot-reload any
      // client currently on "/" — runs alone, after every other project,
      // to avoid corrupting concurrent tests' navigations/DOM state.
      name: "config-driven-mutation",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /path-card-config-driven\.spec\.ts/,
      dependencies: ["chromium", "mobile-chrome", "reduced-motion"],
    },
  ],
});
