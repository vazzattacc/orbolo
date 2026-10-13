import { z } from "astro/zod";

/**
 * Validation rules per specs/002-page-content-specification/data-model.md
 * (InvestPage entity, FR-INV-001–013). Every optional field is a section
 * that stays hidden when absent — see contracts/nav-and-hidden-sections.md.
 */
export const investPageSchema = z.object({
  id: z.literal("invest"),

  hero: z.object({
    headline: z.string().min(1),
    releaseRule: z.string().min(1),
    ctaLabel: z.string().min(1),
    ctaHref: z.string().min(1),
  }),

  offerBox: z.object({
    included: z.array(z.string().min(1)).min(1),
    termsOnRequestNote: z.string().min(1),
  }),

  isThisReal: z.object({
    elTapirIntro: z.string().min(1),
    animalCountMetricKey: z.string().min(1),
    visitBookingCtaLabel: z.string().min(1),
    visitBookingCtaHref: z.string().min(1),
  }),

  whoBuysAtEnd: z.object({
    body: z.string().min(1),
  }),

  whatIfNotEnough: z.object({
    releaseRuleBody: z.string().min(1),
    loiExpiryBody: z.string().min(1),
  }),

  whatIfWrong: z.object({
    categories: z
      .array(
        z.object({
          label: z.string().min(1),
          body: z.string().min(1),
        }),
      )
      .min(1),
    dataRoomNote: z.string().min(1),
  }),

  howItWorks: z.object({
    steps: z
      .array(
        z.object({
          step: z.number().int().positive(),
          body: z.string().min(1),
        }),
      )
      .length(7),
  }),

  deploymentPipeline: z
    .object({
      ranchSlugs: z.array(z.string().min(1)),
    })
    .optional(),

  whatYouOwn: z.object({
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

  faq: z.object({
    items: z
      .array(
        z.object({
          question: z.string().min(1),
          answer: z.string().min(1),
        }),
      )
      .min(1),
  }),

  closing: z.object({
    releaseLine: z.string().min(1),
    ctas: z
      .array(
        z.object({
          label: z.string().min(1),
          href: z.string().min(1),
        }),
      )
      .min(1),
  }),

  crossLinkToBeef: z.object({
    label: z.string().min(1),
    href: z.string().min(1),
  }),
});

export type InvestPage = z.infer<typeof investPageSchema>;
