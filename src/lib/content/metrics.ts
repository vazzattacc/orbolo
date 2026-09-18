export interface MetricInput {
  key: string;
  label: string;
  value: string;
  unit?: string;
  asOfDate: string;
  source: string;
}

export interface MetricView {
  key: string;
  label: string;
  value: string;
  unit?: string;
  asOfDate: string;
  source: string;
}

/**
 * Pure — no I/O — directly unit-testable. Returns undefined, never a
 * partially-filled object, when `asOfDate` or `source` is missing (FR-031).
 */
export function evaluateMetric(raw: MetricInput | undefined): MetricView | undefined {
  if (!raw) return undefined;
  const { asOfDate, source } = raw;
  if (!asOfDate || !source || asOfDate.trim() === "" || source.trim() === "") {
    return undefined;
  }
  return { key: raw.key, label: raw.label, value: raw.value, unit: raw.unit, asOfDate, source };
}

/**
 * Callers MUST treat `undefined` as "omit this number from the render,"
 * never as an error to surface to the visitor.
 */
export async function getMetricValue(key: string): Promise<MetricView | undefined> {
  const { getEntry } = await import("astro:content");
  const entry = await getEntry("metrics", key);
  return evaluateMetric(entry?.data);
}
