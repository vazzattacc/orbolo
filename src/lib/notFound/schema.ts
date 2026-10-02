import { z } from "astro/zod";

/**
 * Validation rules per specs/003-site-launch-essentials/data-model.md
 * (NotFoundContent entity). Single-entry collection.
 */
export const notFoundContentSchema = z.object({
  id: z.literal("notFound"),
  heading: z.string().min(1),
  body: z.string().min(1),
  homeLinkLabel: z.string().min(1),
});

export type NotFoundContent = z.infer<typeof notFoundContentSchema>;
