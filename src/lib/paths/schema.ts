import { z } from "astro/zod";

/**
 * Validation rules per specs/001-orbolo-path-selection/data-model.md.
 * Shared by src/content.config.ts (the live `paths` collection) and by
 * tests/unit/path-repository.test.ts (schema-only validation tests), so the
 * "malformed content fails loudly at build time" contract (FR-023) doesn't
 * require mutating the real paths.json fixture to exercise.
 */
export const pathCardSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "id must be a lowercase, URL-safe slug"),
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.object({
    src: z.string().min(1),
    alt: z.string().min(1),
  }),
  destination: z.string().startsWith("/", "destination must be an internal route"),
  targetAudience: z.string().min(1),
  order: z.number().optional(),
});
