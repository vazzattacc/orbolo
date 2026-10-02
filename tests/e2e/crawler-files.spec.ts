import { expect, test } from "@playwright/test";

// quickstart.md Scenario 2 — FR-SEO-007/008, SC-005, SC-006

test("robots.txt allows all crawlers and references the sitemap", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain("User-agent: *");
  expect(body).toContain("Allow: /");
  expect(body).toContain("Sitemap: https://orbolo.com/sitemap.xml");
});

test("sitemap.xml lists exactly the shipped public pages and excludes /404", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const body = await response.text();

  for (const route of ["https://orbolo.com/", "https://orbolo.com/invest", "https://orbolo.com/beef", "https://orbolo.com/land", "https://orbolo.com/contact"]) {
    expect(body).toContain(`<loc>${route}</loc>`);
  }
  expect(body).not.toContain("/404");
  // Privacy/Terms aren't approved yet — must not appear until they are.
  expect(body).not.toContain("/privacy");
  expect(body).not.toContain("/terms");
});

test("favicon, manifest, and the shared social-preview image all resolve", async ({ request }) => {
  for (const path of [
    "/favicon.ico",
    "/apple-touch-icon.png",
    "/icon-192.png",
    "/icon-512.png",
    "/site.webmanifest",
    "/images/social/og-default.png",
  ]) {
    const response = await request.get(path);
    expect(response.status(), `${path} should return 200`).toBe(200);
  }
});
