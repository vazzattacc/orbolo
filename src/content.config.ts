import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { pathCardSchema } from "./lib/paths/schema";
import { metricSchema } from "./lib/metrics/schema";
import { ranchCardSchema } from "./lib/ranches/schema";
import { investPageSchema } from "./lib/invest/schema";
import { settingsSchema } from "./lib/settings/schema";
import { beefPageSchema } from "./lib/beef/schema";
import { landPageSchema } from "./lib/land/schema";

const paths = defineCollection({
  loader: file("src/content/paths/paths.json"),
  schema: pathCardSchema,
});

const metrics = defineCollection({
  loader: file("src/content/metrics/metrics.json"),
  schema: metricSchema,
});

const ranches = defineCollection({
  loader: file("src/content/ranches/ranches.json"),
  schema: ranchCardSchema,
});

const invest = defineCollection({
  loader: file("src/content/invest/invest.json"),
  schema: investPageSchema,
});

const settings = defineCollection({
  loader: file("src/content/settings/settings.json"),
  schema: settingsSchema,
});

const beef = defineCollection({
  loader: file("src/content/beef/beef.json"),
  schema: beefPageSchema,
});

const land = defineCollection({
  loader: file("src/content/land/land.json"),
  schema: landPageSchema,
});

export const collections = { paths, metrics, ranches, invest, settings, beef, land };
