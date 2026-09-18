import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { evaluateMetric, type MetricInput } from "@/lib/content/metrics";

function makeMetric(overrides: Partial<MetricInput> = {}): MetricInput {
  return {
    key: "export-volume-2026",
    label: "Projected 2026 exports",
    value: "490,000",
    unit: "t cwe",
    asOfDate: "2026-01-15",
    source: "SENACSA/USDA report",
    ...overrides,
  };
}

describe("evaluateMetric", () => {
  it("returns the metric when asOfDate and source are both present", () => {
    const result = evaluateMetric(makeMetric());
    expect(result).toEqual(makeMetric());
  });

  it("returns undefined when the metric itself is undefined", () => {
    expect(evaluateMetric(undefined)).toBeUndefined();
  });

  it("returns undefined (not a partial object) when asOfDate is missing", () => {
    expect(evaluateMetric(makeMetric({ asOfDate: "" }))).toBeUndefined();
  });

  it("returns undefined (not a partial object) when source is missing", () => {
    expect(evaluateMetric(makeMetric({ source: "" }))).toBeUndefined();
  });

  it("returns undefined when both are whitespace-only", () => {
    expect(evaluateMetric(makeMetric({ asOfDate: "   ", source: "   " }))).toBeUndefined();
  });
});

describe("evaluateMetric omission holds across every consuming Section (T051)", () => {
  // Both NumbersRow.astro and AudienceCards.astro import getMetricValue from
  // this same module, which itself is evaluateMetric plus an astro:content
  // lookup — proving evaluateMetric's omit-if-unsourced behavior here proves
  // it for every Section that renders a Metric, structurally (Principle
  // VIII: one isolated implementation, many consumers), not by re-testing
  // each component's rendering separately.
  it("NumbersRow.astro and AudienceCards.astro both call getMetricValue, not their own metric logic", () => {
    const numbersRow = readFileSync(join(__dirname, "../../src/components/sections/NumbersRow.astro"), "utf-8");
    const audienceCards = readFileSync(join(__dirname, "../../src/components/sections/AudienceCards.astro"), "utf-8");
    expect(numbersRow).toContain('import { getMetricValue } from "@/lib/content/metrics"');
    expect(audienceCards).toContain('import { getMetricValue } from "@/lib/content/metrics"');
    // Both may display metric.asOfDate/source (a caption), but neither
    // re-implements the omit-if-unsourced *validation* itself — no local
    // truthiness/emptiness check on asOfDate or source outside the shared accessor.
    const reimplementsValidation = /if\s*\(\s*!.*(asOfDate|source)|(asOfDate|source)\s*(===|!==)\s*["']/;
    expect(numbersRow).not.toMatch(reimplementsValidation);
    expect(audienceCards).not.toMatch(reimplementsValidation);
  });
});
