import { describe, expect, it } from "vitest";
import { getContactPage } from "../../src/lib/contact/contact-repository";
import { contactPageSchema, type ContactPage } from "../../src/lib/contact/schema";
import { ERROR_CODES, FIELD_ORDER, TOPICS } from "../../src/lib/contact/validation";

// specs/005-contact-form: FR-GEN5-002 / FR-TEST-001, data-model.md §2.
const strings = (value: unknown): string[] =>
  typeof value === "string"
    ? [value]
    : value && typeof value === "object"
      ? Object.values(value).flatMap(strings)
      : [];
const keyPaths = (o: object): string[] =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === "object" ? keyPaths(v).map((x) => `${k}.${x}`) : [k],
  );

describe("getContactPage", () => {
  it("resolves in English and Spanish, with the same shape", async () => {
    const [en, es] = [await getContactPage("en"), await getContactPage("es")];
    expect(en.id).toBe("contact");
    expect(es.id).toBe("contact-es");
    expect(keyPaths(es).sort()).toEqual(keyPaths(en).sort());
  });

  it.each(["en", "es"] as const)("%s: every string is non-empty", async (locale) => {
    const page = await getContactPage(locale);
    for (const value of strings(page)) expect(value.trim().length).toBeGreaterThan(0);
  });

  it.each(["en", "es"] as const)(
    "%s: every field has exactly its contract error codes, translated",
    async (locale) => {
      const page = await getContactPage(locale);
      for (const field of FIELD_ORDER) {
        expect(Object.keys(page.errors[field]).sort(), field).toEqual(
          [...ERROR_CODES[field]].sort(),
        );
      }
    },
  );

  it.each(["en", "es"] as const)(
    "%s: topic options are keyed by the four contract codes",
    async (locale) => {
      const page = await getContactPage(locale);
      expect(Object.keys(page.form.topic.options).sort()).toEqual([...TOPICS].sort());
    },
  );

  it("keeps the stub text that the Contact page showed before this feature, verbatim", async () => {
    expect((await getContactPage("en")).stubBody).toBe(
      "Own a herd, buy beef, or bring your land: this is where we talk. Our contact form is on its way.",
    );
    expect((await getContactPage("es")).stubBody).toBe(
      "Ser dueño de un rodeo, comprar carne o sumar tu tierra: aquí es donde hablamos. Nuestro formulario de contacto llega pronto.",
    );
  });

  it.each(["en", "es"] as const)(
    "%s: placeholders are present where the page substitutes them",
    async (locale) => {
      const page = await getContactPage(locale);
      expect(page.form.fields.message.remaining).toContain("{n}");
      expect(page.failure.emailLead).toContain("{email}");
      expect(page.errors.titlePrefix).toBe("Error: ");
    },
  );
});

describe("contactPageSchema", () => {
  it("rejects an entry that lacks one error translation", async () => {
    const page: ContactPage = structuredClone(await getContactPage("en"));
    expect(contactPageSchema.safeParse(page).success).toBe(true);
    const emailWithoutInvalid: Partial<ContactPage["errors"]["email"]> = { ...page.errors.email };
    delete emailWithoutInvalid.invalid;
    const broken = { ...page, errors: { ...page.errors, email: emailWithoutInvalid } };
    expect(contactPageSchema.safeParse(broken).success).toBe(false);
  });

  it("rejects an empty string", async () => {
    const page = structuredClone(await getContactPage("en"));
    page.form.send.label = "";
    expect(contactPageSchema.safeParse(page).success).toBe(false);
  });
});
