import { expect, test } from "@playwright/test";

// specs/005-contact-form — FR-GATE-001 / SC-007 (quickstart.md scenario 10).
// Runs only in the `production-build` project, against a real `astro build`
// made without the endpoint (scripts/ensure-production-preview.mjs). Until
// the endpoint is configured and the privacy wording is approved, production
// must show exactly the stub that was there before the form existed.
const STUBS = [
  {
    path: "/contact",
    h1: "Contact",
    body: "Own a herd, buy beef, or bring your land: this is where we talk. Our contact form is on its way.",
  },
  {
    path: "/es/contact",
    h1: "Contacto",
    body: "Ser dueño de un rodeo, comprar carne o sumar tu tierra: aquí es donde hablamos. Nuestro formulario de contacto llega pronto.",
  },
];

for (const stub of STUBS) {
  test(`${stub.path}: shows the stub and no form while the gate is closed`, async ({ page }) => {
    const response = await page.goto(stub.path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(stub.h1);
    await expect(page.locator(".phero__side")).toHaveText(stub.body);
    await expect(page.locator("form")).toHaveCount(0);
    await expect(page.locator("[data-contact-form]")).toHaveCount(0);
    await expect(page.locator("[data-contact-preview]")).toHaveCount(0);
  });
}

for (const path of [
  "/contact/thanks",
  "/contact/error",
  "/es/contact/thanks",
  "/es/contact/error",
]) {
  test(`${path} is not published while the gate is closed`, async ({ request }) => {
    const response = await request.get(path);
    expect(response.status()).toBe(404);
  });
}

test("the sitemap lists none of the form's result pages", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).toContain("https://orbolo.com/contact");
  expect(xml).not.toContain("/contact/thanks");
  expect(xml).not.toContain("/contact/error");
});
