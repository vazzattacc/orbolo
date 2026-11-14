import { expect, test } from "@playwright/test";
import { bodyTextOutsideRegenerativeException } from "./approved-exceptions";

// English stays at the original URLs; Spanish lives under /es. The EN/ES
// switch in the Primary nav leads to the same page in the other language.
const PAIRS = [
  { en: "/", es: "/es" },
  { en: "/invest", es: "/es/invest" },
  { en: "/beef", es: "/es/beef" },
  { en: "/land", es: "/es/land" },
  { en: "/about", es: "/es/about" },
  { en: "/contact", es: "/es/contact" },
];

for (const { en, es } of PAIRS) {
  test(`${en} ⇄ ${es}: the switch leads to the same page in the other language`, async ({ page }) => {
    await page.goto(en);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Español" }).click();
    await expect(page).toHaveURL(new RegExp(`${es.replace(/\//g, "\\/")}\\/?$`));
    await expect(page.locator("html")).toHaveAttribute("lang", "es");

    await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "English" }).click();
    await expect(page).toHaveURL(new RegExp(`${en === "/" ? "" : en.replace(/\//g, "\\/")}\\/?$`));
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test(`${es}: hreflang alternates point at both versions`, async ({ page }) => {
    await page.goto(es);
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute("href", `https://orbolo.com${en}`);
    await expect(page.locator('link[hreflang="es"]')).toHaveAttribute("href", `https://orbolo.com${es}`);
  });
}

test("Spanish nav keeps every link inside /es", async ({ page }) => {
  await page.goto("/es/beef");
  const nav = page.getByRole("navigation", { name: "Principal" });
  for (const [name, href] of [
    ["Inicio", "/es"],
    ["Remote Rancher", "/es/invest"],
    ["Carne & Co", "/es/beef"],
    ["Educación", "/es/land"],
    ["Nosotros", "/es/about"],
    ["Contacto", "/es/contact"],
  ]) {
    await expect(nav.getByRole("link", { name, exact: true })).toHaveAttribute("href", href);
  }
});

test("Spanish path cards lead to Spanish pages", async ({ page }) => {
  await page.goto("/es");
  const card = page.locator("[data-path-card]").first();
  await card.scrollIntoViewIfNeeded();
  await card.locator("[data-path-card-trigger]").click();
  await expect(card.locator("[data-path-card-discover]")).toHaveAttribute("href", "/es/invest");
});

test("English-only pages switch to the Spanish home page", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Español" })).toHaveAttribute(
    "href",
    "/es",
  );
});

test("Spanish pages avoid investing vocabulary and the banned words", async ({ page }) => {
  for (const { es } of PAIRS) {
    await page.goto(es);
    const text = await bodyTextOutsideRegenerativeException(page);
    for (const word of ["invers", "invertir", "rentabilidad", "sostenible", "impacto", "ecosistema", "regenerativ", "garantizad"]) {
      expect(text, `"${word}" on ${es}`).not.toContain(word);
    }
  }
});

test("the sitemap lists both languages", async ({ request }) => {
  const body = await (await request.get("/sitemap.xml")).text();
  for (const { en, es } of PAIRS) {
    expect(body).toContain(`<loc>https://orbolo.com${en}</loc>`);
    expect(body).toContain(`<loc>https://orbolo.com${es}</loc>`);
  }
});
