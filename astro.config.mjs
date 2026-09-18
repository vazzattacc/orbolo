import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import keystatic from "@keystatic/astro";

// Keystatic's admin route needs a live server endpoint to save content,
// which conflicts with a pure static build. Rather than pull the whole
// public site into "hybrid"/"server" output (and add a hosting adapter
// dependency Firebase Hosting doesn't need otherwise), the admin UI is
// dev-only: content editors run `pnpm dev` locally to use /keystatic, and
// the production build never includes that route at all. The public site
// itself stays output: "static" exactly as the brief specifies (§2).
const isProductionBuild = process.env.NODE_ENV === "production";

export default defineConfig({
  site: "https://orbolo.com",
  output: "static",
  integrations: [tailwind(), sitemap(), ...(isProductionBuild ? [] : [keystatic()])],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "de"],
    routing: {
      prefixDefaultLocale: true,
      // Astro's built-in redirect only targets the default locale. FR-038
      // wants a redirect based on the visitor's actual language preference
      // (es/de too), which a fully static site can only do client-side (no
      // server to read the Accept-Language header) — see src/pages/index.astro.
      redirectToDefaultLocale: false,
    },
  },
});
