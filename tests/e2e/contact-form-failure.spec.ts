import { expect, test, type Page } from "@playwright/test";
import { fillValidEnquiry, gotoContact, mockContactEndpoint } from "./support/contact-endpoint";

// specs/005-contact-form — User Story 3 (quickstart.md scenario 5): when the
// endpoint is down, slow or rate-limiting, the visitor is told, keeps what
// they typed, and gets the team's email address.
const LOCALES = [
  {
    path: "/contact",
    topic: "Buying beef",
    generic:
      "Your message did not go through. Everything you typed is still here. Please try again.",
    rateLimited: "Too many messages were sent in a short time. Please try again in a few minutes.",
    send: "Send",
  },
  {
    path: "/es/contact",
    topic: "Comprar carne",
    generic: "Tu mensaje no se envió. Todo lo que escribiste sigue aquí. Inténtalo de nuevo.",
    rateLimited:
      "Se enviaron demasiados mensajes en poco tiempo. Inténtalo de nuevo en unos minutos.",
    send: "Enviar",
  },
] as const;

// dev preview's reserved fallback address (research.md §3); the real one is OQ-C1
const PREVIEW_EMAIL = "contact@example.com";

async function expectFailure(page: Page, l: (typeof LOCALES)[number], message: string) {
  const failure = page.locator("[data-contact-failure]");
  await expect(failure).toBeVisible();
  await expect(failure).toContainText(message);
  await expect(failure.locator(`a[href="mailto:${PREVIEW_EMAIL}"]`)).toHaveText(PREVIEW_EMAIL);
  // FR-UX-013: announced through the status region
  await expect(page.locator("[data-contact-status]")).toContainText(message);
  // FR-UX-007: nothing typed is lost; never the thanks page
  await expect(page.locator("#contact-name")).toHaveValue("Ana Pérez");
  await expect(page.locator("#contact-email")).toHaveValue("ana@example.com");
  await expect(page.locator("#contact-message")).toHaveValue(
    "We would like to talk about volumes.",
  );
  await expect(page.getByRole("radio", { name: l.topic })).toBeChecked();
  await expect(page).toHaveURL(new RegExp(`${l.path}/?$`));
  // the button is back to normal and can be pressed again
  const send = page.locator("[data-contact-send]");
  await expect(send).not.toHaveAttribute("aria-busy", "true");
  await expect(send).toHaveText(l.send);
}

for (const l of LOCALES) {
  for (const behaviour of ["serverError", "networkError"] as const) {
    test(`${l.path}: ${behaviour} shows the failure message with the email fallback (US3-AS1)`, async ({
      page,
    }) => {
      await mockContactEndpoint(page, behaviour);
      await gotoContact(page, l.path);
      await fillValidEnquiry(page, l.topic);
      await page.locator("[data-contact-send]").click();
      await expectFailure(page, l, l.generic);
    });
  }

  test(`${l.path}: no answer within 15 seconds is a failure (FR-UX-011)`, async ({ page }) => {
    await page.clock.install();
    const endpoint = await mockContactEndpoint(page, "hang");
    await gotoContact(page, l.path);
    await fillValidEnquiry(page, l.topic);
    await page.locator("[data-contact-send]").click();
    await expect(page.locator("[data-contact-send]")).toHaveAttribute("aria-busy", "true");

    await page.clock.fastForward(14_000);
    await expect(page.locator("[data-contact-failure]")).toBeHidden();
    await page.clock.fastForward(1_500);
    await expectFailure(page, l, l.generic);
    expect(endpoint.posts).toHaveLength(1);
  });

  test(`${l.path}: "too many requests" says to try again in a few minutes (US3-AS2)`, async ({
    page,
  }) => {
    await mockContactEndpoint(page, "rateLimited");
    await gotoContact(page, l.path);
    await fillValidEnquiry(page, l.topic);
    await page.locator("[data-contact-send]").click();
    await expectFailure(page, l, l.rateLimited);
  });
}

test("after a failure, a second Send goes out and can succeed", async ({ page }) => {
  let behaviour: "serverError" | "success" = "serverError";
  const posts: unknown[] = [];
  await page.route("https://contact-endpoint.orbolo.test/**", async (route) => {
    const origin = route.request().headers()["origin"] ?? "*";
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (route.request().method() === "OPTIONS")
      return route.fulfill({ status: 204, headers: cors });
    posts.push(route.request().postDataJSON());
    return route.fulfill({
      status: behaviour === "success" ? 201 : 500,
      headers: cors,
      body: "{}",
    });
  });
  await gotoContact(page, "/contact");
  await fillValidEnquiry(page, "Buying beef");
  await page.locator("[data-contact-send]").click();
  await expect(page.locator("[data-contact-failure]")).toBeVisible();

  behaviour = "success";
  await page.locator("[data-contact-send]").click();
  await expect(page).toHaveURL(/\/contact\/thanks\/?$/);
  expect(posts).toHaveLength(2);
});

test("an endpoint error code this page doesn't know is treated as a generic failure", async ({
  page,
}) => {
  await mockContactEndpoint(page, "fieldErrors", { fieldErrors: { email: "blocklisted" } });
  await gotoContact(page, "/contact");
  await fillValidEnquiry(page, "Buying beef");
  await page.locator("[data-contact-send]").click();
  await expect(page.locator("[data-contact-failure]")).toContainText(
    "Your message did not go through.",
  );
  await expect(page.locator("[data-contact-summary]")).toBeHidden();
});
