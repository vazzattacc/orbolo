import { getEntry } from "astro:content";

export interface Metric {
  key: string;
  value: number | string;
  unit?: string;
  asOfDate: string;
  sourceDocumentRef: string;
}

/**
 * Sole consumer of the `metrics` content collection. Implements FR-GEN-005:
 * a number without a visible date and source must not render at all, so
 * this returns `undefined` — never a partially-filled object — whenever
 * `asOfDate` or `sourceDocumentRef` is missing or empty. Callers (chiefly
 * MetricValue.astro) MUST treat `undefined` as "render nothing," never
 * substitute a placeholder.
 */
export async function getMetric(key: string): Promise<Metric | undefined> {
  const entry = await getEntry("metrics", key);
  if (!entry) return undefined;

  const { asOfDate, sourceDocumentRef } = entry.data;
  if (!asOfDate.trim() || !sourceDocumentRef.trim()) return undefined;

  return {
    key: entry.data.id,
    value: entry.data.value,
    unit: entry.data.unit,
    asOfDate,
    sourceDocumentRef,
  };
}
