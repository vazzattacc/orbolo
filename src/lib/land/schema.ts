import { z } from "astro/zod";

/**
 * Validation rules per specs/002-page-content-specification/data-model.md
 * (LandPage entity, FR-LAND-001–004). Every optional field is a section
 * that stays hidden when absent — see contracts/nav-and-hidden-sections.md.
 */
export const landPageSchema = z.object({
  id: z.literal("land"),

  elTapir: z.object({
    intro: z.string().min(1),
    hectaresMetricKey: z.string().min(1),
    expansionTargetNote: z.string().optional(),
  }),

  partnerRanches: z
    .object({
      ranchSlugs: z.array(z.string().min(1)),
    })
    .optional(),

  ganaderiaAPasto: z.object({
    body: z.string().min(1),
    hectaresMetricKey: z.string().min(1),
  }),

  workWithUs: z.object({
    ctaLabel: z.string().min(1),
    ctaHref: z.string().min(1),
  }),
});

export type LandPage = z.infer<typeof landPageSchema>;
