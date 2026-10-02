import { z } from "astro/zod";

/**
 * Validation rules per specs/003-site-launch-essentials/data-model.md
 * (LegalDocument entity). Zero, one, or two entries — absence is a valid,
 * expected state (FR-LEG-004), not an error.
 */
export const legalDocumentSchema = z.object({
  id: z.enum(["privacy", "terms"]),
  sourceUrl: z.url(),
  fetchedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "fetchedOn must be an ISO date (YYYY-MM-DD)"),
  sourceLastUpdated: z.string().optional(),
  body: z
    .array(
      z.object({
        heading: z.string().min(1),
        paragraphs: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(1),
  approved: z.boolean(),
  // Always present (may be empty) so "no flaggable passages found" is an
  // explicit statement, not an omitted field that reads as "not reviewed."
  reviewNotes: z.array(z.string()),
});

export type LegalDocument = z.infer<typeof legalDocumentSchema>;
