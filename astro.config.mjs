import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // Brief §11: "Domains: orbolo.com primary" — resolves spec 003's FR-SEO-008
  // NEEDS CLARIFICATION (research.md §1). Required for canonical-link
  // generation in Layout.astro and for src/pages/sitemap.xml.ts's absolute
  // URLs. (@astrojs/sitemap was tried first and dropped — its default
  // output is /sitemap-index.xml, not the literal /sitemap.xml FR-SEO-008/
  // SC-005 name; a small custom endpoint gets the exact path AND lets the
  // Privacy/Terms gating logic decide inclusion directly, rather than
  // relying on Astro's static-route discovery — research.md §2, revised.)
  site: "https://orbolo.com",
  vite: {
    plugins: [tailwindcss()],
  },
});
