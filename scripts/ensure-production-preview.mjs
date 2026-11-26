#!/usr/bin/env node
// The `production-build` Playwright project (playwright.config.ts) tests
// what actually ships: the closed contact-form gate (FR-GATE-001 / SC-007)
// and the photo byte budgets (SC-009). Both need a real `astro build`
// served on its own port, beside the dev server that the other projects use.
//
// The build always runs, so the preview never serves stale output. The two
// contact-form variables are removed from the child environment: the gate
// must be tested closed, exactly as production is until Vaz opens it.
import { spawn, spawnSync } from "node:child_process";

const URL = "http://localhost:4322/";

async function isUp() {
  try {
    const res = await fetch(URL);
    return res.status < 500;
  } catch {
    return false;
  }
}

const env = { ...process.env };
delete env.PUBLIC_CONTACT_ENDPOINT;
delete env.CONTACT_FORM_PREVIEW;

const build = spawnSync("npx", ["astro", "build"], { stdio: "inherit", env });
if (build.status !== 0) {
  console.error("ensure-production-preview: astro build failed");
  process.exit(build.status ?? 1);
}

if (await isUp()) {
  process.exit(0);
}

// Like scripts/ensure-dev-server.mjs: start it detached and poll, so it
// works whether or not this CLI build keeps `astro preview` in the foreground.
spawn("npx", ["astro", "preview", "--port", "4322"], {
  stdio: "ignore",
  detached: true,
  env,
}).unref();

const deadline = Date.now() + 60_000;
while (!(await isUp())) {
  if (Date.now() > deadline) {
    console.error("ensure-production-preview: timed out waiting for the preview server");
    process.exit(1);
  }
  await new Promise((resolve) => setTimeout(resolve, 300));
}
process.exit(0);
