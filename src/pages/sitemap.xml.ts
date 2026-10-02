import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getLegalDocument } from "../lib/legal/legal-repository";

/**
 * FR-SEO-008 / SC-005: a literal /sitemap.xml listing every shipped,
 * indexable public page — the 404 route is simply never a pageMeta entry
 * (data-model.md), so it can never appear here by construction, and
 * Privacy/Terms are included only once getLegalDocument() actually
 * resolves for them, matching the same gating Footer.astro uses
 * (contracts/footer-and-legal-gating.md).
 */
export const GET: APIRoute = async ({ site }) => {
  const pageMetaEntries = await getCollection("pageMeta");
  const routes = pageMetaEntries.filter((entry) => entry.data.indexable).map((entry) => entry.data.route);

  const [privacy, terms] = await Promise.all([getLegalDocument("privacy"), getLegalDocument("terms")]);
  if (privacy) routes.push("/privacy");
  if (terms) routes.push("/terms");

  const urls = routes
    .map((route) => `  <url><loc>${new URL(route, site).href}</loc></url>`)
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml" },
  });
};
