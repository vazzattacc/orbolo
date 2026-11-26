import { expect, test } from "@playwright/test";
import {
  CONTACT_ENDPOINT,
  fillValidEnquiry,
  gotoContact,
  mockContactEndpoint,
} from "./support/contact-endpoint";

// specs/005-contact-form — User Story 1 (quickstart.md scenarios 1 and 2):
// a visitor sends an enquiry once and lands on the thanks page.
const LOCALES = [
  {
    locale: "en",
    path: "/contact",
    thanks: /\/contact\/thanks\/?$/,
    topic: "Buying beef",
    send: "Send",
    sending: "Sending…",
    thanksH1: "Thank you",
  },
  {
    locale: "es",
    path: "/es/contact",
    thanks: /\/es\/contact\/thanks\/?$/,
    topic: "Comprar carne",
    send: "Enviar",
    sending: "Enviando…",
    thanksH1: "Gracias",
  },
] as const;

for (const l of LOCALES) {
  test(`${l.path}: a valid enquiry is sent once with the contract fields and lands on the thanks page (US1-AS1/AS2)`, async ({
    page,
  }) => {
    const endpoint = await mockContactEndpoint(page, "success");
    await gotoContact(page, l.path);
    await fillValidEnquiry(page, l.topic);
    await page.locator("[data-contact-send]").click();

    await expect(page).toHaveURL(l.thanks);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(l.thanksH1);
    await expect(page.locator("html")).toHaveAttribute("lang", l.locale);

    expect(endpoint.posts).toHaveLength(1);
    const { contentType, body } = endpoint.posts[0];
    expect(contentType).toContain("application/json");
    // FR-API-002: exactly these keys; callMe is absent unless ticked
    expect(Object.keys(body).sort()).toEqual(
      [
        "email",
        "locale",
        "message",
        "name",
        "organisation",
        "page",
        "phone",
        "renderedAt",
        "topic",
        "website",
      ].sort(),
    );
    expect(body).toMatchObject({
      name: "Ana Pérez",
      email: "ana@example.com",
      phone: "",
      organisation: "",
      topic: "beef",
      message: "We would like to talk about volumes.",
      locale: l.locale,
      page: l.path,
      website: "",
    });
    expect(typeof body.renderedAt).toBe("number");
  });

  test(`${l.path}: Send shows a sending state and a second press sends nothing more (US1-AS4)`, async ({
    page,
  }) => {
    const endpoint = await mockContactEndpoint(page, "hang");
    await gotoContact(page, l.path);
    await fillValidEnquiry(page, l.topic);

    const send = page.locator("[data-contact-send]");
    await expect(send).toHaveText(l.send);
    await send.click();
    await expect(send).toHaveAttribute("aria-busy", "true");
    await expect(send).toHaveText(l.sending);
    await expect(page.locator("[data-contact-status]")).toHaveText(l.sending);
    // FR-UX-009: never disabled, yet further presses are ignored
    await expect(send).toBeEnabled();
    await send.click();
    await page.keyboard.press("Enter");
    expect(endpoint.posts).toHaveLength(1);
  });
}

test("ticking Please call me sends callMe: true", async ({ page }) => {
  const endpoint = await mockContactEndpoint(page, "success");
  await gotoContact(page, "/contact");
  await fillValidEnquiry(page, "Something else");
  await page.locator("#contact-phone").fill("+34 600 00 00 00");
  await page.locator("#contact-callMe").check();
  await page.locator("[data-contact-send]").click();
  await expect(page).toHaveURL(/\/contact\/thanks\/?$/);
  expect(endpoint.posts[0].body).toMatchObject({
    callMe: true,
    phone: "+34 600 00 00 00",
    topic: "other",
  });
});

test("arriving from a page CTA, no topic is preselected (US1-AS3)", async ({ page }) => {
  await page.goto("/land");
  await page.getByRole("link", { name: "Work with us" }).first().click();
  await expect(page).toHaveURL(/\/contact\/?$/);
  await expect(page.locator('input[name="topic"]')).toHaveCount(4);
  await expect(page.locator('input[name="topic"]:checked')).toHaveCount(0);
});

test("the script wires the form: novalidate, renderedAt, ready flag; the form posts to the configured endpoint", async ({
  page,
}) => {
  const before = Date.now();
  await gotoContact(page, "/contact");
  const form = page.locator("[data-contact-form]");
  await expect(form).toHaveAttribute("novalidate", "");
  await expect(form).toHaveAttribute("action", CONTACT_ENDPOINT);
  await expect(form).toHaveAttribute("method", "post");
  const renderedAt = Number(await page.locator('input[name="renderedAt"]').inputValue());
  expect(renderedAt).toBeGreaterThanOrEqual(before);
  expect(renderedAt).toBeLessThanOrEqual(Date.now());
});

test("the Message field counts the characters that remain", async ({ page }) => {
  await gotoContact(page, "/contact");
  const hint = page.locator("#contact-message-remaining");
  await expect(hint).toHaveText("2000 characters left");
  await page.locator("#contact-message").fill("Hello there");
  await expect(hint).toHaveText("1989 characters left");
  await expect(page.locator("#contact-message")).toHaveAttribute(
    "aria-describedby",
    "contact-message-remaining",
  );
});

test("the form has exactly the seven visitor fields, each with a visible label, in order (FR-FIELD-001/004, FR-UX-001)", async ({
  page,
}) => {
  await gotoContact(page, "/contact");
  const form = page.locator("[data-contact-form]");
  const names = await form
    .locator("input:not([type=hidden]):not([name=website]), textarea")
    .evaluateAll((els) => [...new Set(els.map((el) => (el as HTMLInputElement).name))]);
  expect(names).toEqual(["name", "email", "phone", "organisation", "topic", "message", "callMe"]);
  for (const [id, label] of [
    ["contact-name", "Name"],
    ["contact-email", "Email"],
    ["contact-phone", "Phone (optional)"],
    ["contact-organisation", "Organisation (optional)"],
    ["contact-message", "Message"],
  ]) {
    await expect(page.locator(`label[for="${id}"]`)).toBeVisible();
    await expect(page.locator(`label[for="${id}"]`)).toHaveText(label, { ignoreCase: true });
    await expect(page.locator(`#${id}`)).not.toHaveAttribute("placeholder", /.+/);
  }
  await expect(page.getByRole("radiogroup", { name: "I'm interested in" })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "Please call me" })).toBeVisible();
  // FR-LEG5-001: the privacy line sits with the Send button and links to the Privacy page
  await expect(page.locator("[data-contact-privacy] a")).toHaveAttribute("href", "/privacy");
});

test("the honeypot is out of the tab order and the accessibility tree (FR-FIELD-003)", async ({
  page,
}) => {
  await gotoContact(page, "/contact");
  const honeypot = page.locator('input[name="website"]');
  await expect(honeypot).toHaveAttribute("tabindex", "-1");
  await expect(honeypot).toHaveAttribute("autocomplete", "off");
  await expect(page.locator(".contact-hp")).toHaveAttribute("aria-hidden", "true");
  expect(await honeypot.evaluate((el) => el.getBoundingClientRect().right)).toBeLessThan(0);
});
