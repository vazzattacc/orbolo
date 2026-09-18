#!/usr/bin/env tsx
// CI content-compliance gate (T017, wired into `pnpm run lint:content`).
// Scans every published page's sections AND every cross-referenced
// collection that can surface user-visible text on a page (Rules, Partner
// quotes) — a page's own JSON alone isn't enough, since e.g. a Code rule's
// text is pulled in by slug, not inlined. Terms are scanned in "glossary"
// context since the Glossary is exactly where they're defined (FR-032, SC-005).

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { assertContentCompliance, type ComplianceResult } from "../src/lib/content/compliance.ts";

const CONTENT_DIR = join(import.meta.dirname, "..", "src", "content");

function walk(dir: string): string[] {
  const entries = readdirSync(dir);
  return entries.flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return full.endsWith(".json") ? [full] : [];
  });
}

function extractStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") {
    out.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) extractStrings(item, out);
  } else if (value && typeof value === "object") {
    for (const v of Object.values(value)) extractStrings(v, out);
  }
  return out;
}

let hasFailure = false;

function report(file: string, result: ComplianceResult) {
  if (result.passed) return;
  hasFailure = true;
  console.error(`\n✗ ${file}`);
  for (const violation of result.violations) {
    console.error(`  [${violation.type}] "${violation.match}" — …${violation.context}…`);
  }
}

// Pages: sections are stored as a JSON string inside `sectionsJson`.
for (const file of walk(join(CONTENT_DIR, "pages_en"))) {
  const raw = JSON.parse(readFileSync(file, "utf-8"));
  const sections = raw.sectionsJson ? JSON.parse(raw.sectionsJson) : [];
  const text = [raw.title, raw.seoDescription, ...extractStrings(sections)].filter(Boolean).join("\n");
  const isGlossaryPage = raw.slug === "glossary";
  report(file, assertContentCompliance(text, { context: isGlossaryPage ? "glossary" : "general" }));
}

// Rules (The Code) — rendered on Home (codeStrip) and /the-code, general context.
for (const file of walk(join(CONTENT_DIR, "rules"))) {
  const raw = JSON.parse(readFileSync(file, "utf-8"));
  const text = [raw.rule, raw.verifiedHow].filter(Boolean).join("\n");
  report(file, assertContentCompliance(text, { context: "general" }));
}

// Partner quotes — rendered wherever the partner is displayed, general context.
for (const file of walk(join(CONTENT_DIR, "partners"))) {
  const raw = JSON.parse(readFileSync(file, "utf-8"));
  if (raw.quote) report(file, assertContentCompliance(raw.quote, { context: "general" }));
}

// Terms (Glossary) — this IS the defined-term context, always exempt.
for (const file of walk(join(CONTENT_DIR, "terms"))) {
  const raw = JSON.parse(readFileSync(file, "utf-8"));
  const text = [raw.definition, raw.measuredBy, raw.notThis].filter(Boolean).join("\n");
  report(file, assertContentCompliance(text, { context: "glossary" }));
}

if (hasFailure) {
  console.error("\nContent compliance check failed (FR-032). Fix the violations above.");
  process.exit(1);
} else {
  console.log("✓ Content compliance check passed — no banned words, no 'regenerative'/'guaranteed' violations.");
}
