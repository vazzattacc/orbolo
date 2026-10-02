import { z } from "astro/zod";

/**
 * Validation rules per specs/003-site-launch-essentials/data-model.md
 * (PageMeta entity). `canonicalUrl` is deliberately NOT a field here — it's
 * computed from `route` + Astro's `site` config at render time, never
 * stored, so it can't drift from astro.config.mjs (research.md §8).
 */
export const pageMetaSchema = z.object({
  id: z.string().regex(/^[a-z][a-zA-Z0-9]*$/, "id must be a lowercase-leading camelCase slug"),
  route: z.string().startsWith("/", "route must be an internal path"),
  // FR-SEO-002 targets "roughly 120-160 characters" — a soft editorial
  // guideline, not a hard contract an approved real description should be
  // able to violate by a few characters. Bounds here only catch genuine
  // mistakes (an empty/placeholder string, or a multi-paragraph dump).
  description: z.string().min(40, "description looks too short to be a real meta description").max(220),
  indexable: z.boolean(),
});

export type PageMeta = z.infer<typeof pageMetaSchema>;
