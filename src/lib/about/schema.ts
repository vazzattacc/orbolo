import { z } from "astro/zod";

/**
 * About Us page content. Sources: .specify/references/orbolo_storyline.md,
 * orbolo_ecosystem_protocol.md and remote_rancher.md §1–4, filtered through
 * the brief's language rules (Orbolo facilitates and trades; it never takes
 * the money) and banned-word list.
 */
const labelledLine = z.object({
  label: z.string().min(1),
  body: z.string().min(1),
});

export const aboutPageSchema = z.object({
  id: z.literal("about"),

  hero: z.object({
    lede: z.string().min(1),
  }),

  story: z.object({
    heading: z.string().min(1),
    paragraphs: z.array(z.string().min(1)).min(1),
  }),

  oldIdea: z.object({
    heading: z.string().min(1),
    paragraphs: z.array(z.string().min(1)).min(1),
  }),

  howTheGroupWorks: z.object({
    heading: z.string().min(1),
    roles: z.array(labelledLine).min(1),
  }),

  principles: z.object({
    heading: z.string().min(1),
    items: z.array(labelledLine).min(1),
  }),

  whyParaguay: z.object({
    heading: z.string().min(1),
    body: z.string().min(1),
  }),

  whereWeAre: z.object({
    heading: z.string().min(1),
    animalCountMetricKey: z.string().min(1),
    gappHectaresMetricKey: z.string().min(1),
    building: z.array(z.string().min(1)),
    notYet: z.array(z.string().min(1)),
  }),

  faq: z.object({
    heading: z.string().min(1),
    items: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })).min(1),
  }),

  closing: z.object({
    heading: z.string().min(1),
    body: z.string().min(1),
    ctas: z.array(z.object({ label: z.string().min(1), href: z.string().min(1) })).min(1),
  }),
});

export type AboutPage = z.infer<typeof aboutPageSchema>;
