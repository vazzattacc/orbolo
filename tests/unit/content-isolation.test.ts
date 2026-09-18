import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// T052: no page or Section component may import astro:content directly —
// every content read goes through lib/content/* (Constitution Principle VIII).
// This is a structural regression guard, not a one-time manual audit.

function collectFiles(dir: string, extension: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(full, extension, out);
    else if (entry.name.endsWith(extension)) out.push(full);
  }
  return out;
}

describe("content-access isolation (Constitution Principle VIII)", () => {
  it("no file under src/pages or src/components imports astro:content directly", () => {
    const root = join(__dirname, "../../src");
    const files = [...collectFiles(join(root, "pages"), ".astro"), ...collectFiles(join(root, "components"), ".astro")];
    const offenders = files.filter((file) => readFileSync(file, "utf-8").includes('from "astro:content"'));
    expect(offenders).toEqual([]);
  });
});
