import { z } from "astro/zod";

/**
 * Validation rules per specs/002-page-content-specification/data-model.md
 * (Metric entity). `id` is the file() loader's entry identity and doubles
 * as the lookup key data-model.md calls "key" — there is no separate field
 * for it, to avoid two names for the same value.
 *
 * FR-GEN-005: every displayed number needs a visible date + source. This
 * schema makes both required at the content layer; metrics-repository.ts
 * additionally treats an empty-string source as equivalent to missing.
 */
export const metricSchema = z.object({
  id: z.string().regex(/^[a-z][a-zA-Z0-9]*$/, "id must be a lowercase-leading camelCase key"),
  value: z.union([z.number(), z.string().min(1)]),
  unit: z.string().min(1).optional(),
  asOfDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "asOfDate must be an ISO date (YYYY-MM-DD)"),
  sourceDocumentRef: z.string().min(1),
});

export type Metric = z.infer<typeof metricSchema>;
