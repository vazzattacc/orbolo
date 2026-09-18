import { config, fields, collection, singleton } from "@keystatic/core";

// One collection/singleton per Entity in specs/002-orbolo-website/data-model.md.
// Content is stored as files in this repo (research.md §1) — Keystatic never
// talks to a third-party content API, so a git commit IS a publish event.

const LOCALES = ["en", "es", "de"] as const;

export default config({
  storage: { kind: "local" },
  collections: {
    partners: collection({
      label: "Partners",
      slugField: "name",
      path: "src/content/partners/*",
      format: { data: "json" },
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        logo: fields.image({ label: "Logo", directory: "public/images/partners" }),
        role: fields.text({ label: "Role", validation: { isRequired: true } }),
        quote: fields.text({ label: "Quote (requires written permission on file)", multiline: true }),
        pages: fields.array(fields.text({ label: "Page slug" }), {
          label: "Displayed on pages",
          itemLabel: (props) => props.value || "page",
        }),
      },
    }),

    terms: collection({
      label: "Glossary Terms",
      slugField: "term",
      path: "src/content/terms/*",
      format: { data: "json" },
      schema: {
        term: fields.slug({ name: { label: "Term" } }),
        definition: fields.text({ label: "Definition", multiline: true, validation: { isRequired: true } }),
        measuredBy: fields.text({ label: "Measured by", multiline: true, validation: { isRequired: true } }),
        notThis: fields.text({ label: "What it is NOT", multiline: true, validation: { isRequired: true } }),
        group: fields.text({ label: "Group" }),
        locale: fields.select({
          label: "Language (FR-039: Glossary is translated first and fully per language)",
          options: [
            { label: "English", value: "en" },
            { label: "Español", value: "es" },
            { label: "Deutsch", value: "de" },
          ],
          defaultValue: "en",
        }),
      },
    }),

    rules: collection({
      label: "The Code — Rules",
      slugField: "number",
      path: "src/content/rules/*",
      format: { data: "json" },
      schema: {
        number: fields.slug({ name: { label: "Rule number (1-8)" } }),
        rule: fields.text({ label: "Rule", multiline: true, validation: { isRequired: true } }),
        verifiedHow: fields.text({ label: "Verified how", multiline: true, validation: { isRequired: true } }),
        verifier: fields.relationship({ label: "Verifier (Partner)", collection: "partners", validation: { isRequired: true } }),
        terms: fields.array(fields.relationship({ label: "Related term", collection: "terms" }), {
          label: "Related glossary terms",
          itemLabel: (props) => props.value || "term",
        }),
        locale: fields.select({
          label: "Language (FR-039: The Code is translated first and fully per language)",
          options: [
            { label: "English", value: "en" },
            { label: "Español", value: "es" },
            { label: "Deutsch", value: "de" },
          ],
          defaultValue: "en",
        }),
      },
    }),

    metrics: collection({
      label: "Metrics",
      slugField: "key",
      path: "src/content/metrics/*",
      format: { data: "json" },
      schema: {
        key: fields.slug({ name: { label: "Key" } }),
        label: fields.text({ label: "Label", validation: { isRequired: true } }),
        value: fields.text({ label: "Value", validation: { isRequired: true } }),
        unit: fields.text({ label: "Unit" }),
        // FR-031: asOfDate and source are required at the schema level so an
        // unsourced Metric cannot even be saved, let alone rendered.
        asOfDate: fields.date({ label: "As-of date", validation: { isRequired: true } }),
        source: fields.text({ label: "Source (document reference/URL)", validation: { isRequired: true } }),
      },
    }),

    ranches: collection({
      label: "Ranches",
      slugField: "codename",
      path: "src/content/ranches/*",
      format: { data: "json" },
      schema: {
        codename: fields.slug({ name: { label: "Codename (e.g. Ranch 04)" } }),
        region: fields.text({ label: "Region (department level)", validation: { isRequired: true } }),
        hectares: fields.number({ label: "Hectares", validation: { isRequired: true } }),
        system: fields.text({ label: "Grazing system", validation: { isRequired: true } }),
        yearsInHolisticManagement: fields.number({ label: "Years in holistic management" }),
        mpcsStatus: fields.select({
          label: "MPCS status",
          options: [
            { label: "Member", value: "member" },
            { label: "In transition", value: "in transition" },
            { label: "Not yet", value: "not yet" },
          ],
          defaultValue: "in transition",
        }),
        checklist: fields.object({
          mpcsMember: fields.checkbox({ label: "MPCS member" }),
          minYearsTransition: fields.checkbox({ label: "Minimum years in transition" }),
          waterSecurity: fields.checkbox({ label: "Water security" }),
          deforestationFreeSatellite: fields.checkbox({ label: "Deforestation-free by satellite" }),
          contractInPlace: fields.checkbox({ label: "Contract in place" }),
        }, { label: "Selection checklist" }),
        threshold: fields.integer({ label: "Threshold (head count)", validation: { isRequired: true } }),
        cycleLength: fields.text({ label: "Cycle length" }),
        opensDate: fields.date({ label: "Opens date" }),
        updatedDate: fields.date({ label: "Last updated date (refresh at least weekly)", validation: { isRequired: true } }),
        manualStatus: fields.select({
          label:
            "Manual status override (Planned / Due diligence / Filling / Deployed — the Open for LOI / Released / Full states are always computed from LOIs, never set here)",
          options: [
            { label: "(computed from LOIs)", value: "" },
            { label: "Planned", value: "Planned" },
            { label: "Due diligence", value: "Due diligence" },
            { label: "Filling (past release, still below 100%)", value: "Filling" },
            { label: "Deployed", value: "Deployed" },
          ],
          defaultValue: "",
        }),
        photos: fields.array(fields.image({ label: "Photo", directory: "public/images/ranches" }), {
          label: "Photos (public only if ownerConsent.photographed)",
          itemLabel: () => "photo",
        }),
        ownerConsentNamed: fields.checkbox({ label: "Owner consents to being named" }),
        ownerConsentPhotographed: fields.checkbox({ label: "Owner consents to photos being shown" }),
        // Private layer (data-model.md) — never read by public-facing accessors.
        exactName: fields.text({ label: "[PRIVATE] Exact name" }),
        exactLocation: fields.text({ label: "[PRIVATE] Exact location" }),
        owner: fields.text({ label: "[PRIVATE] Owner" }),
      },
    }),

    lois: collection({
      label: "Letters of Intent",
      slugField: "id",
      path: "src/content/lois/*",
      format: { data: "json" },
      schema: {
        id: fields.slug({ name: { label: "LOI ID" } }),
        ranch: fields.relationship({ label: "Ranch", collection: "ranches", validation: { isRequired: true } }),
        signerEmail: fields.text({ label: "Signer email", validation: { isRequired: true } }),
        headCount: fields.integer({ label: "Head count", validation: { isRequired: true } }),
        ticket: fields.number({ label: "Ticket size" }),
        signedDate: fields.date({ label: "Signed date", validation: { isRequired: true } }),
        converted: fields.checkbox({ label: "Converted to contract" }),
      },
    }),

    roadmapMilestones: collection({
      label: "Roadmap Milestones",
      slugField: "title",
      path: "src/content/roadmapMilestones/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        stage: fields.select({
          label: "Stage",
          options: [
            { label: "Now", value: "now" },
            { label: "Building", value: "building" },
            { label: "Target", value: "target" },
          ],
          defaultValue: "now",
        }),
        targetDate: fields.date({ label: "Target date", validation: { isRequired: true } }),
        doneDate: fields.date({ label: "Done date" }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Planned", value: "planned" },
            { label: "In progress", value: "in-progress" },
            { label: "Done", value: "done" },
          ],
          defaultValue: "planned",
        }),
      },
    }),

    teamMembers: collection({
      label: "Team Members",
      slugField: "name",
      path: "src/content/teamMembers/*",
      format: { data: "json" },
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        role: fields.text({ label: "Role", validation: { isRequired: true } }),
        background: fields.text({ label: "Background", multiline: true }),
        photo: fields.image({ label: "Photo", directory: "public/images/team" }),
      },
    }),

    blogPosts: collection({
      label: "Blog Posts",
      slugField: "title",
      path: "src/content/blogPosts/*",
      format: { contentField: "body", data: "json" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        publishedDate: fields.date({ label: "Published date", validation: { isRequired: true } }),
        author: fields.relationship({ label: "Author", collection: "teamMembers" }),
        body: fields.markdoc({ label: "Body" }),
      },
    }),

    ...Object.fromEntries(
      LOCALES.map((locale) => [
        `pages_${locale}`,
        collection({
          label: `Pages (${locale})`,
          slugField: "slug",
          path: `src/content/pages_${locale}/*`,
          format: { data: "json" },
          schema: {
            slug: fields.slug({ name: { label: "Slug" } }),
            title: fields.text({ label: "Title", validation: { isRequired: true } }),
            status: fields.select({
              label: "Status",
              options: [
                { label: "Published", value: "published" },
                { label: "Draft", value: "draft" },
              ],
              defaultValue: "draft",
            }),
            seoDescription: fields.text({ label: "SEO description", multiline: true }),
            // Sections are authored as a typed JSON array; validated against the
            // Zod schema in src/content/config.ts at build time, not here.
            sectionsJson: fields.text({
              label: "Sections (JSON — see data-model.md Section union)",
              multiline: true,
              validation: { isRequired: true },
            }),
          },
        }),
      ]),
    ),
  },
  singletons: {
    settings: singleton({
      label: "Settings",
      path: "src/content/settings",
      format: { data: "json" },
      schema: {
        productName: fields.text({ label: "Product name", defaultValue: "Remote Rancher" }),
        contractingEntityLine: fields.text({ label: "Contracting entity line (pending legal input)" }),
        contactEmails: fields.text({ label: "Contact emails (comma-separated)" }),
        socialsLine: fields.text({ label: "Socials line" }),
      },
    }),
  },
});
