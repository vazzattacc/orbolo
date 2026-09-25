import { z } from "astro/zod";

/**
 * Validation rules per specs/002-page-content-specification/data-model.md
 * (Settings / ContractingEntity entity). Single-entry collection.
 */
export const settingsSchema = z.object({
  id: z.literal("settings"),
  contractingEntityName: z.string().min(1),
});

export type Settings = z.infer<typeof settingsSchema>;
