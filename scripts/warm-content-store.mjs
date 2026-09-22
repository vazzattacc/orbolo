#!/usr/bin/env node
// Vitest resolves `astro:content` from .astro/data-store.json (the
// dev-mode content store). That file is only written when an `astro dev`
// session shuts down cleanly (its content layer flushes on stop) —
// `astro sync`/`astro build` populate node_modules/.astro instead, which
// Vitest's content virtual-mod plugin never reads, since it keys its store
// location off Vite's `env.command === "serve"` (always true under
// Vitest), independent of `getViteConfig`'s own dev/build resolution.
// This warms that dev-mode store once per checkout/content-change so
// `pnpm run test:unit` doesn't depend on a dev server already having run.
import { existsSync } from "node:fs";
import { execFileSync, spawn } from "node:child_process";

const STORE_PATH = new URL("../.astro/data-store.json", import.meta.url);

if (existsSync(STORE_PATH)) {
  process.exit(0);
}

const dev = spawn("npx", ["astro", "dev", "--port", "4322"], {
  stdio: "ignore",
});

await new Promise((resolve) => setTimeout(resolve, 3000));

try {
  execFileSync("npx", ["astro", "dev", "stop"], { stdio: "ignore" });
} catch {
  // fall through to the existence check below
}

dev.kill();

const deadline = Date.now() + 10_000;
while (!existsSync(STORE_PATH) && Date.now() < deadline) {
  await new Promise((resolve) => setTimeout(resolve, 250));
}

if (!existsSync(STORE_PATH)) {
  console.error("warm-content-store: timed out waiting for .astro/data-store.json");
  process.exit(1);
}
