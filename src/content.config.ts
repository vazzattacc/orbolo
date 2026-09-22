import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { pathCardSchema } from "./lib/paths/schema";

const paths = defineCollection({
  loader: file("src/content/paths/paths.json"),
  schema: pathCardSchema,
});

export const collections = { paths };
