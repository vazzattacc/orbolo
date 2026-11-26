import { expect, test } from "@playwright/test";
import { CONTACT_ENDPOINT, mockContactEndpoint } from "./support/contact-endpoint";

// specs/005-contact-form — US1-AS5 and US3-AS3 (quickstart.md scenario 3):
// with JavaScript off the form is an ordinary form. The browser checks it,
// the endpoint answers with a redirect, and the visitor lands on the thanks
// page or the failure page.
test.use({ javaScriptEnabled: false });

const LOCALES = [
  {
    path: "/contact",
    prefix: "",
    topic: "Buying beef",
    thanksH1: "Thank you",
    errorH1: "Message not sent",
    back: "Back to Contact",
  },
  {
    path: "/es/contact",
    prefix: "/es",
    topic: "Comprar carne",
    thanksH1: "Gracias",
    errorH1: "Mensaje no enviado",
    back: "Volver a Contacto",
  },
] as const;

async function fill(page: import("@playwright/test").Page, topic: string) {
  await page.locator("#contact-name").fill("Ana Pérez");
  await page.locator("#contact-email").fill("ana@example.com");
  await page.getByRole("radio", { name: topic }).check();
  await page.locator("#contact-message").fill("We would like to talk about volumes.");
}

test("without JavaScript the browser's own checks are in place (FR-UX-010)", async ({ page }) => {
  await page.goto("/contact");
  const form = page.locator("[data-contact-form]");
  await expect(form).toHaveAttribute("method", "post");
  await expect(form).toHaveAttribute("action", CONTACT_ENDPOINT);
  await expect(form).not.toHaveAttribute("novalidate", "");
  await expect(page.locator("#contact-name")).toHaveAttribute("required", "");
  await expect(page.locator("#contact-name")).toHaveAttribute("maxlength", "120");
  await expect(page.locator("#contact-email")).toHaveAttribute("type", "email");
  await expect(page.locator("#contact-email")).toHaveAttribute("maxlength", "254");
  await expect(page.locator("#contact-phone")).toHaveAttribute("maxlength", "40");
  await expect(page.locator("#contact-organisation")).toHaveAttribute("maxlength", "160");
  await expect(page.locator("#contact-message")).toHaveAttribute("minlength", "10");
  await expect(page.locator("#contact-message")).toHaveAttribute("maxlength", "2000");
  await expect(page.locator('input[name="topic"]').first()).toHaveAttribute("required", "");
});

for (const l of LOCALES) {
  test(`${l.path}: a valid native post lands on the thanks page (US1-AS5)`, async ({ page }) => {
    const endpoint = await mockContactEndpoint(page, "success");
    await page.goto(l.path);
    await fill(page, l.topic);
    await page.locator("[data-contact-send]").click();

    await expect(page).toHaveURL(new RegExp(`${l.prefix}/contact/thanks/?$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(l.thanksH1);
    expect(endpoint.posts).toHaveLength(1);
    expect(endpoint.posts[0].contentType).toContain("application/x-www-form-urlencoded");
    expect(endpoint.posts[0].body).toMatchObject({
      name: "Ana Pérez",
      email: "ana@example.com",
      topic: l.topic === "Buying beef" ? "beef" : "beef",
      locale: l.prefix ? "es" : "en",
      page: l.path,
      renderedAt: "",
      website: "",
    });
  });

  test(`${l.path}: when the endpoint fails, the visitor lands on the failure page with a way through (US3-AS3)`, async ({
    page,
  }) => {
    await mockContactEndpoint(page, "serverError");
    await page.goto(l.path);
    await fill(page, l.topic);
    await page.locator("[data-contact-send]").click();

    await expect(page).toHaveURL(new RegExp(`${l.prefix}/contact/error/?$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(l.errorH1);
    await expect(page.locator('main a[href="mailto:contact@example.com"]')).toBeVisible();
    await expect(page.getByRole("link", { name: l.back })).toHaveAttribute(
      "href",
      `${l.prefix}/contact`,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
  });
}
