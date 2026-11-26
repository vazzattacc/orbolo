import { defineConfig, envField, sharpImageService } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // Brief §11: "Domains: orbolo.com primary" — resolves spec 003's FR-SEO-008
  // NEEDS CLARIFICATION (spec 003 R1). Required for canonical-link
  // generation in Layout.astro and for src/pages/sitemap.xml.ts's absolute
  // URLs. (@astrojs/sitemap was tried first and dropped — its default
  // output is /sitemap-index.xml, not the literal /sitemap.xml FR-SEO-008/
  // SC-005 name; a small custom endpoint gets the exact path AND lets the
  // Privacy/Terms gating logic decide inclusion directly, rather than
  // relying on Astro's static-route discovery — spec 003 R11.)
  site: "https://orbolo.com",
  // specs/005-contact-form (research.md §26): `astro dev` encodes every photo
  // on every request, with no cache, and the e2e suite runs against it. AVIF
  // at the encoder's default effort takes 0.6–1.6 s per photo; at effort 0 it
  // takes 30–60 ms for a file about 3% larger. Builds keep the default, so
  // what ships (and the SC-009 byte budgets) is unchanged.
  ...(process.argv.includes("dev") ? { image: { service: sharpImageService({ avif: { effort: 0 } }) } } : {}),
  // specs/005-contact-form (FR-GATE-002, research.md §1 and §3): the contact
  // endpoint is configuration, never code. Unset = the form is not published.
  // A malformed URL fails the build instead of shipping a form that posts
  // nowhere. CONTACT_FORM_PREVIEW is honoured only by `astro dev`
  // (src/lib/contact/gate.ts); .env.development sets both for local work.
  env: {
    schema: {
      PUBLIC_CONTACT_ENDPOINT: envField.string({ context: "client", access: "public", optional: true, url: true }),
      CONTACT_FORM_PREVIEW: envField.boolean({ context: "server", access: "public", default: false }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
