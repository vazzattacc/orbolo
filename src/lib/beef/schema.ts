import { z } from "astro/zod";

/**
 * Validation rules per specs/002-page-content-specification/data-model.md
 * (BeefPage entity, FR-BEEF-001–010). Every optional field is a section
 * that stays hidden when absent — see contracts/nav-and-hidden-sections.md.
 * No `namedCustomers` field exists anywhere — OQ-011 resolved "No,"
 * definitively, not a placeholder.
 */
export const beefPageSchema = z.object({
  id: z.literal("beef"),

  hero: z.object({
    headline: z.string().min(1),
    allianceNote: z.string().min(1),
  }),

  whatWeSellToday: z.object({
    body: z.string().min(1),
    noFullHistoryNote: z.string().min(1),
  }),

  promise: z.object({
    body: z.string().min(1),
  }),

  roadmap: z
    .object({
      milestones: z.array(
        z.object({
          stage: z.string().min(1),
          body: z.string().min(1),
          targetDate: z.string().optional(),
        }),
      ),
    })
    .optional(),

  firstPick: z.object({
    body: z.string().min(1),
  }),

  whySupplyDifferent: z.object({
    body: z.string().min(1),
  }),

  whoVerifies: z.object({
    codeReferenceNote: z.string().min(1),
    verifiers: z
      .array(
        z.object({
          role: z.string().min(1),
          name: z.string().min(1),
        }),
      )
      .optional(),
  }),

  ctas: z
    .array(
      z.object({
        label: z.string().min(1),
        href: z.string().min(1),
      }),
    )
    .min(1),

  crossLinkToInvest: z.object({
    label: z.string().min(1),
    href: z.string().min(1),
  }),
});

export type BeefPage = z.infer<typeof beefPageSchema>;
