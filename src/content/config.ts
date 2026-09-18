import { defineCollection, z } from "astro:content";

// Mirrors data-model.md exactly (field names/types/required-ness) and reads
// from the same src/content/* directories keystatic.config.ts writes to.

const sectionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("hero"),
    headline: z.string(),
    deck: z.string(),
    buttons: z.array(z.object({ label: z.string(), href: z.string() })),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    imageCaption: z.string().optional(),
    // FR-045 (Visual Identity Delta): a short cursive accent line, at most
    // one per section — never a substitute for headline/deck copy.
    tagline: z.string().optional(),
  }),
  z.object({
    type: z.literal("loop"),
    stages: z.array(z.object({ label: z.string(), href: z.string() })).length(4),
    whyTogetherLines: z.array(z.string()).length(2),
  }),
  z.object({
    type: z.literal("numbers"),
    metricKeys: z.array(z.string()),
  }),
  z.object({
    // Home's "two audience cards" (Investors/Remote Rancher, Buyers/Orbolo
    // beef), each with three dated Metrics and a CTA — FR-005.
    type: z.literal("audienceCards"),
    cards: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        metricKeys: z.array(z.string()).length(3),
        ctaLabel: z.string(),
        ctaHref: z.string(),
      }),
    ),
  }),
  z.object({
    type: z.literal("partnerStrip"),
    partnerSlugs: z.array(z.string()),
  }),
  z.object({
    type: z.literal("codeStrip"),
    ruleSlugs: z.array(z.string()),
  }),
  z.object({
    type: z.literal("pipeline"),
    ranchSlugs: z.array(z.string()),
  }),
  z.object({
    type: z.literal("roadmap"),
    milestoneSlugs: z.array(z.string()),
  }),
  z.object({
    type: z.literal("whereWeAre"),
    operating: z.array(z.object({ text: z.string(), date: z.string() })),
    building: z.array(z.object({ text: z.string(), date: z.string() })),
    next: z.array(z.object({ text: z.string(), date: z.string() })),
    lastUpdated: z.string(),
  }),
  z.object({
    type: z.literal("text"),
    heading: z.string().optional(),
    body: z.string(),
  }),
  z.object({
    // "Why this, why now" (7 arguments) and "What we don't do yet" both use
    // this: each claim sits directly beside its proof/evidence (brief §9).
    type: z.literal("arguments"),
    heading: z.string().optional(),
    items: z.array(z.object({ claim: z.string(), proof: z.string() })),
  }),
  z.object({
    type: z.literal("faq"),
    items: z.array(z.object({ question: z.string(), answer: z.string() })),
  }),
  z.object({
    // The Home closing CTA, split by audience (FR-005).
    type: z.literal("ctaSplit"),
    heading: z.string().optional(),
    items: z.array(z.object({ label: z.string(), href: z.string() })),
  }),
  z.object({
    type: z.literal("formEmbed"),
    formId: z.string(),
    audience: z.enum(["investor", "buyer", "landowner", "general"]),
  }),
]);

const pageSchema = z.object({
  slug: z.string(),
  title: z.string(),
  status: z.enum(["published", "draft"]),
  seoDescription: z.string().optional(),
  sectionsJson: z.string(), // parsed + validated against sectionSchema at read time (lib/content/pages.ts)
});

const partners = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    logo: z.string(),
    role: z.string(),
    quote: z.string().optional(),
    pages: z.array(z.string()).default([]),
  }),
});

// FR-039: The Code and Glossary are translated first and fully, ahead of
// every other page. `locale` groups translated variants of the same
// logical term/rule (matched by `term` / `number`); English is the
// fallback when a locale-specific variant doesn't exist yet.
const terms = defineCollection({
  type: "data",
  schema: z.object({
    term: z.string(),
    definition: z.string(),
    measuredBy: z.string(),
    notThis: z.string(),
    group: z.string().optional(),
    locale: z.enum(["en", "es", "de"]).default("en"),
  }),
});

const rules = defineCollection({
  type: "data",
  schema: z.object({
    number: z.string(),
    rule: z.string(),
    verifiedHow: z.string(),
    verifier: z.string(), // Partner slug
    terms: z.array(z.string()).default([]), // Term slugs
    locale: z.enum(["en", "es", "de"]).default("en"),
  }),
});

const metrics = defineCollection({
  type: "data",
  schema: z.object({
    key: z.string(),
    label: z.string(),
    value: z.string(),
    unit: z.string().optional(),
    asOfDate: z.string(), // FR-031: required
    source: z.string(), // FR-031: required
  }),
});

const ranches = defineCollection({
  type: "data",
  schema: z.object({
    codename: z.string(),
    region: z.string(),
    hectares: z.number(),
    system: z.string(),
    yearsInHolisticManagement: z.number().optional(),
    mpcsStatus: z.enum(["member", "in transition", "not yet"]),
    checklist: z.object({
      mpcsMember: z.boolean(),
      minYearsTransition: z.boolean(),
      waterSecurity: z.boolean(),
      deforestationFreeSatellite: z.boolean(),
      contractInPlace: z.boolean(),
    }),
    threshold: z.number().int(),
    cycleLength: z.string().optional(),
    opensDate: z.string().optional(),
    updatedDate: z.string(),
    manualStatus: z.enum(["", "Planned", "Due diligence", "Filling", "Deployed"]).default(""),
    photos: z.array(z.string()).default([]),
    ownerConsentNamed: z.boolean().default(false),
    ownerConsentPhotographed: z.boolean().default(false),
    // Private layer — present in the raw collection (Keystatic authors it),
    // but lib/content/ranches.ts's public accessor MUST NOT return these.
    exactName: z.string().optional(),
    exactLocation: z.string().optional(),
    owner: z.string().optional(),
  }),
});

const lois = defineCollection({
  type: "data",
  schema: z.object({
    id: z.string(),
    ranch: z.string(), // Ranch slug
    signerEmail: z.string(),
    headCount: z.number().int(),
    ticket: z.number().optional(),
    signedDate: z.string(),
    converted: z.boolean().default(false),
  }),
});

const roadmapMilestones = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    stage: z.enum(["now", "building", "target"]),
    targetDate: z.string(),
    doneDate: z.string().optional(),
    status: z.enum(["planned", "in-progress", "done"]),
  }),
});

const teamMembers = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    role: z.string(),
    background: z.string().optional(),
    photo: z.string().optional(),
  }),
});

const blogPosts = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    publishedDate: z.string(),
    author: z.string().optional(),
    body: z.string(),
  }),
});

const settings = defineCollection({
  type: "data",
  schema: z.object({
    productName: z.string().default("Remote Rancher"),
    contractingEntityLine: z.string().optional(),
    contactEmails: z.string().optional(),
    socialsLine: z.string().optional(),
  }),
});

const pages_en = defineCollection({ type: "data", schema: pageSchema });
const pages_es = defineCollection({ type: "data", schema: pageSchema });
const pages_de = defineCollection({ type: "data", schema: pageSchema });

export const collections = {
  settings,
  partners,
  terms,
  rules,
  metrics,
  ranches,
  lois,
  roadmapMilestones,
  teamMembers,
  blogPosts,
  pages_en,
  pages_es,
  pages_de,
};

export { sectionSchema };
