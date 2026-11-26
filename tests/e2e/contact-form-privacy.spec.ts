import { expect, test, type Page, type Request } from "@playwright/test";
import {
  CONTACT_ENDPOINT,
  fillValidEnquiry,
  gotoContact,
  mockContactEndpoint,
} from "./support/contact-endpoint";

// specs/005-contact-form — FR-AN5-001/002, SC-003 as clarified 2026-11-14
// (quickstart.md scenario 9): the form sets no cookie, touches no storage,
// and talks only to the site, the form endpoint and the site-wide Plausible
// script approved in spec 003. Nothing the visitor types may reach analytics.
const ALLOWED_HOSTS = [new URL(CONTACT_ENDPOINT).host, "plausible.io"];
// recognisable values, so any leak into another request would be found
const SECRET = {
  name: "Zebulon Quillfeather",
  email: "zebulon.quillfeather@example.com",
  phone: "+34 611 222 333",
  organisation: "Estancia Quillfeather",
  message: "Unmistakable message text about forty heifers.",
};

function watch(page: Page) {
  const requests: Request[] = [];
  page.on("request", (request) => requests.push(request));
  return requests;
}

async function expectPrivate(page: Page, requests: Request[]) {
  const site = new URL(page.url()).host;
  for (const request of requests) {
    const url = new URL(request.url());
    if (url.protocol === "data:" || url.protocol === "blob:") continue;
    expect(
      [site, ...ALLOWED_HOSTS],
      `unexpected request to ${url.host}: ${request.url()}`,
    ).toContain(url.host);
    if (url.host === new URL(CONTACT_ENDPOINT).host) continue;
    // no typed value in any URL or body that is not the endpoint's
    const haystack = decodeURIComponent(request.url()) + (request.postData() ?? "");
    for (const value of Object.values(SECRET)) {
      expect(haystack, `${url.host} received a form value`).not.toContain(value);
      expect(haystack).not.toContain(encodeURIComponent(value));
    }
  }
  expect(await page.context().cookies()).toEqual([]);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(
    page.locator(
      'script[src*="captcha" i], script[src*="recaptcha" i], script[src*="turnstile" i]',
    ),
  ).toHaveCount(0);
}

async function fillSecrets(page: Page, topic: string) {
  await fillValidEnquiry(page, topic);
  await page.locator("#contact-name").fill(SECRET.name);
  await page.locator("#contact-email").fill(SECRET.email);
  await page.locator("#contact-phone").fill(SECRET.phone);
  await page.locator("#contact-organisation").fill(SECRET.organisation);
  await page.locator("#contact-message").fill(SECRET.message);
}

for (const [path, topic] of [
  ["/contact", "Buying beef"],
  ["/es/contact", "Comprar carne"],
] as const) {
  test(`${path}: a successful send sets no cookie, uses no storage and leaks nothing`, async ({
    page,
  }) => {
    const requests = watch(page);
    const endpoint = await mockContactEndpoint(page, "success");
    await gotoContact(page, path);
    await expectPrivate(page, requests);

    await fillSecrets(page, topic);
    await page.locator("[data-contact-send]").click();
    await expect(page).toHaveURL(/\/contact\/thanks\/?$/);
    await page.waitForLoadState("networkidle");
    expect(endpoint.posts).toHaveLength(1);
    await expectPrivate(page, requests);
    // FR-AN5-001: the thanks page is a plain URL: no query string, no fragment
    expect(new URL(page.url()).search).toBe("");
    expect(new URL(page.url()).hash).toBe("");
  });

  test(`${path}: a failed send sets no cookie, uses no storage and leaks nothing`, async ({
    page,
  }) => {
    const requests = watch(page);
    await mockContactEndpoint(page, "serverError");
    await gotoContact(page, path);
    await fillSecrets(page, topic);
    await page.locator("[data-contact-send]").click();
    await expect(page.locator("[data-contact-failure]")).toBeVisible();
    await expectPrivate(page, requests);
  });
}

for (const path of [
  "/contact/thanks",
  "/es/contact/thanks",
  "/contact/error",
  "/es/contact/error",
]) {
  test(`${path}: no cookie, no storage, no third party beyond the allowlist, not indexed`, async ({
    page,
  }) => {
    const requests = watch(page);
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await expectPrivate(page, requests);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
  });
}

test("the form script makes no analytics call of its own", async ({ page }) => {
  const plausible: Request[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).host === "plausible.io") plausible.push(request);
  });
  await mockContactEndpoint(page, "serverError");
  await gotoContact(page, "/contact");
  await page.waitForLoadState("networkidle");
  const before = plausible.length;
  await fillSecrets(page, "Buying beef");
  await page.locator("[data-contact-send]").click();
  await expect(page.locator("[data-contact-failure]")).toBeVisible();
  // typing, validating, sending and failing triggered no analytics request
  expect(plausible.length).toBe(before);
});
