#!/usr/bin/env node
// This Astro CLI build's `astro dev` always forks a background daemon and
// exits immediately, which Playwright's `webServer` option reads as "the
// process crashed" (it expects a long-lived foreground process). Rather
// than fight that, we ensure the daemon is up ourselves before Playwright
// runs, exactly like scripts/warm-content-store.mjs does for Vitest.
import { spawn } from "node:child_process";

const URL = "http://localhost:4321/";

async function isUp() {
  try {
    const res = await fetch(URL);
    return res.status < 500;
  } catch {
    return false;
  }
}

if (await isUp()) {
  process.exit(0);
}

spawn("npx", ["astro", "dev", "--port", "4321"], { stdio: "ignore" });

const deadline = Date.now() + 30_000;
while (!(await isUp())) {
  if (Date.now() > deadline) {
    console.error("ensure-dev-server: timed out waiting for the dev server");
    process.exit(1);
  }
  await new Promise((resolve) => setTimeout(resolve, 300));
}
