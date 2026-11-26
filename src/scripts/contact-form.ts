/**
 * Enhances the contact form (src/components/contact/ContactForm.astro,
 * specs/005-contact-form). Without this script the form still posts natively
 * and the browser validates it. With it:
 *
 *  - validation runs on Send, with an error summary above the form (focused)
 *    and a message under each faulty field (FR-UX-002…008);
 *  - a valid enquiry is sent once as JSON, with a 15 s limit (FR-UX-009, 011);
 *  - success is a full navigation to the thanks page, so the site-wide
 *    analytics count it as a page view and nothing else (FR-AN5-001);
 *  - any failure shows a message near Send and keeps every typed value
 *    (FR-UX-007, FR-UX-012).
 *
 * No wording lives here: messages come from the JSON island the component
 * renders. No cookies, no storage, no analytics calls (FR-AN5-002).
 *
 * Same lifecycle as motion.ts: Astro's <ClientRouter /> swaps pages without
 * reloading modules, so the form is wired on astro:page-load and released on
 * astro:before-swap.
 */
import {
  ERROR_CODES,
  FIELD_ORDER,
  LIMITS,
  validateEnquiry,
  type EnquiryValues,
  type Field,
  type FieldErrors,
} from "@/lib/contact/validation";

interface Messages {
  errors: Record<Field, Record<string, string>>;
  titlePrefix: string;
  inlinePrefix: string;
  sendLabel: string;
  sending: string;
  remaining: string;
  failure: { generic: string; rateLimited: string };
  thanksPath: string;
}

const TIMEOUT_MS = 15_000;
const REMAINING_ANNOUNCE_MS = 1_000;

let release: (() => void) | null = null;

function init() {
  const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
  const island = document.querySelector<HTMLScriptElement>("[data-contact-messages]");
  if (!form || !island || form.hasAttribute("data-contact-ready")) return;

  const messages = JSON.parse(island.textContent ?? "{}") as Messages;
  const summary = document.querySelector<HTMLElement>("[data-contact-summary]");
  const summaryList = summary?.querySelector("ul") ?? null;
  const status = form.querySelector<HTMLElement>("[data-contact-status]");
  const failure = form.querySelector<HTMLElement>("[data-contact-failure]");
  const failureText = form.querySelector<HTMLElement>("[data-contact-failure-text]");
  const send = form.querySelector<HTMLButtonElement>("[data-contact-send]");
  const sendLabel = send?.querySelector<HTMLElement>(".btn__label") ?? null;
  const message = form.querySelector<HTMLTextAreaElement>("#contact-message");
  const remaining = form.querySelector<HTMLElement>("[data-contact-remaining]");
  const remainingLive = form.querySelector<HTMLElement>("[data-contact-remaining-live]");
  const renderedAt = form.querySelector<HTMLInputElement>('input[name="renderedAt"]');

  const baseTitle = document.title;
  let sending = false;
  let attempted = false;
  // codes the endpoint returned (422); kept until the visitor edits that field
  let serverErrors: FieldErrors = {};
  // what is on screen now, so an unchanged result never rebuilds the summary
  let shown = "{}";
  let remainingTimer: number | undefined;
  // a press is under way; a re-check that moved the page now could make it miss
  let pointerDown = false;
  let recheckPending = false;

  /** The element that carries aria-invalid and the error message. */
  const control = (field: Field) => form.querySelector<HTMLElement>(`#contact-${field}`);
  /** The element that takes focus from a summary link. */
  const focusTarget = (field: Field) =>
    field === "topic" ? form.querySelector<HTMLElement>("#contact-topic-first") : control(field);
  const text = (name: string) =>
    (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null)?.value ?? "";

  function read(): EnquiryValues {
    return {
      name: text("name"),
      email: text("email"),
      phone: text("phone"),
      organisation: text("organisation"),
      topic: form!.querySelector<HTMLInputElement>('input[name="topic"]:checked')?.value ?? "",
      message: text("message"),
      callMe: form!.querySelector<HTMLInputElement>('input[name="callMe"]')?.checked ?? false,
    };
  }

  function clearErrors() {
    form!.querySelectorAll("[data-contact-error]").forEach((el) => el.remove());
    for (const field of FIELD_ORDER) {
      const el = control(field);
      if (!el) continue;
      el.removeAttribute("aria-invalid");
      const base = el.dataset.describedby ?? "";
      if (base) el.setAttribute("aria-describedby", base);
      else el.removeAttribute("aria-describedby");
    }
  }

  /** Shows `errors` under their fields and in the summary; an empty object clears everything. */
  function showErrors(errors: FieldErrors, focusSummary: boolean) {
    const next = JSON.stringify(errors);
    if (next === shown) {
      if (focusSummary && next !== "{}") summary?.focus();
      return;
    }
    shown = next;
    clearErrors();
    const fields = FIELD_ORDER.filter((field) => errors[field]);
    if (summaryList) summaryList.replaceChildren();

    for (const field of fields) {
      const el = control(field);
      if (!el) continue;
      const messageText = messages.errors[field][errors[field]!];

      const error = document.createElement("p");
      error.id = `contact-${field}-error`;
      error.className = "cform__error";
      error.setAttribute("data-contact-error", "");
      const prefix = document.createElement("span");
      prefix.className = "sr-only";
      prefix.textContent = `${messages.inlinePrefix} `;
      error.append(prefix, messageText);
      // a radio group holds its message inside the group; other fields get it right below the control
      if (field === "topic") el.append(error);
      else el.after(error);

      el.setAttribute("aria-invalid", "true");
      el.setAttribute(
        "aria-describedby",
        [el.dataset.describedby, error.id].filter(Boolean).join(" "),
      );

      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#contact-${field}`;
      link.dataset.contactField = field;
      link.textContent = messageText;
      item.append(link);
      summaryList?.append(item);
    }

    const hasErrors = fields.length > 0;
    if (summary) summary.hidden = !hasErrors;
    document.title = hasErrors ? `${messages.titlePrefix}${baseTitle}` : baseTitle;
    if (hasErrors && focusSummary) summary?.focus();
  }

  function setBusy(busy: boolean) {
    if (send) {
      if (busy) send.setAttribute("aria-busy", "true");
      else send.removeAttribute("aria-busy");
    }
    if (sendLabel) sendLabel.textContent = busy ? messages.sending : messages.sendLabel;
    if (busy && status) status.textContent = messages.sending;
  }

  function hideFailure() {
    if (failure) failure.hidden = true;
  }

  function fail(kind: keyof Messages["failure"]) {
    if (failureText) failureText.textContent = messages.failure[kind];
    if (failure) failure.hidden = false;
    // the status region announces it; the block itself is not a live region
    if (status)
      status.textContent =
        failure?.textContent?.replace(/\s+/g, " ").trim() ?? messages.failure[kind];
  }

  /** The endpoint's 422 body, if every field and code in it is one this page knows. */
  async function readFieldErrors(response: Response): Promise<FieldErrors | null> {
    try {
      const body = (await response.json()) as { errors?: Record<string, string> };
      const entries = Object.entries(body.errors ?? {});
      if (entries.length === 0) return null;
      const known: FieldErrors = {};
      for (const [field, code] of entries) {
        if (!(FIELD_ORDER as readonly string[]).includes(field)) return null;
        if (!(ERROR_CODES[field as Field] as readonly string[]).includes(code)) return null;
        known[field as Field] = code as FieldErrors[Field];
      }
      return known;
    } catch {
      return null;
    }
  }

  async function onSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (sending) return;

    attempted = true;
    serverErrors = {};
    hideFailure();
    const values = read();
    const errors = validateEnquiry(values);
    showErrors(errors, true);
    if (Object.keys(errors).length > 0) return;

    sending = true;
    setBusy(true);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
    let leaving = false;

    try {
      const response = await fetch(form!.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        signal: controller.signal,
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          organisation: values.organisation.trim(),
          topic: values.topic,
          message: values.message.trim(),
          ...(values.callMe ? { callMe: true } : {}),
          locale: text("locale"),
          page: text("page"),
          renderedAt: Number(text("renderedAt")) || undefined,
          website: text("website"),
        }),
      });

      if (response.ok) {
        // a full page load, never a query string: the thanks page view is the only signal
        leaving = true;
        window.location.assign(messages.thanksPath);
      } else if (response.status === 422) {
        const fieldErrors = await readFieldErrors(response);
        if (fieldErrors) {
          serverErrors = fieldErrors;
          showErrors(fieldErrors, true);
        } else {
          fail("generic");
        }
      } else if (response.status === 429) {
        fail("rateLimited");
      } else {
        fail("generic");
      }
    } catch {
      // network error, or the 15 s limit
      fail("generic");
    } finally {
      window.clearTimeout(timer);
      if (!leaving) {
        sending = false;
        setBusy(false);
      }
    }
  }

  /** After a failed Send, a field is checked again when the visitor leaves it (FR-UX-002). */
  function recheck() {
    recheckPending = false;
    if (!attempted || sending) return;
    showErrors({ ...validateEnquiry(read()), ...serverErrors }, false);
  }

  function onFocusOut(event: FocusEvent) {
    if (!attempted || sending) return;
    // on the way to a summary link: rebuilding the list now would swallow that click
    if (event.relatedTarget instanceof Node && summary?.contains(event.relatedTarget)) return;
    // Focus left because something is being pressed. Removing a message above
    // it would shift the page between press and release, and the click would
    // land somewhere else. Wait until the press is over.
    if (pointerDown) {
      recheckPending = true;
      return;
    }
    recheck();
  }

  function onPointerDown() {
    pointerDown = true;
  }

  function onPointerUp() {
    pointerDown = false;
    // after the click event that follows this release has been handled
    if (recheckPending) window.setTimeout(recheck, 0);
  }

  function onInput(event: Event) {
    const name = (event.target as HTMLInputElement).name as Field;
    if (name in serverErrors) delete serverErrors[name];
    if (event.target === message) updateRemaining();
  }

  function updateRemaining() {
    if (!message || !remaining) return;
    const label = messages.remaining.replace(
      "{n}",
      String(LIMITS.message.max - message.value.length),
    );
    remaining.textContent = label;
    // screen readers hear the count only after a pause, not on every key
    window.clearTimeout(remainingTimer);
    remainingTimer = window.setTimeout(() => {
      if (remainingLive) remainingLive.textContent = label;
    }, REMAINING_ANNOUNCE_MS);
  }

  /** Summary links move focus to their field. Stopped here so motion.ts doesn't turn them into a smooth scroll. */
  function onSummaryClick(event: MouseEvent) {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[data-contact-field]");
    if (!link) return;
    event.preventDefault();
    event.stopPropagation();
    focusTarget(link.dataset.contactField as Field)?.focus();
  }

  /** Coming back with the Back button must show a usable form, never a stuck "Sending…". */
  function onPageShow(event: PageTransitionEvent) {
    if (!event.persisted) return;
    sending = false;
    setBusy(false);
    if (status) status.textContent = "";
  }

  // remember each control's own description (its hint) so errors can be added and removed around it
  for (const field of FIELD_ORDER) {
    const el = control(field);
    if (el) el.dataset.describedby = el.getAttribute("aria-describedby") ?? "";
  }

  form.noValidate = true;
  if (renderedAt) renderedAt.value = String(Date.now());
  updateRemaining();
  window.clearTimeout(remainingTimer);

  form.addEventListener("submit", onSubmit);
  form.addEventListener("focusout", onFocusOut);
  form.addEventListener("input", onInput);
  summary?.addEventListener("click", onSummaryClick);
  document.addEventListener("pointerdown", onPointerDown, true);
  document.addEventListener("pointerup", onPointerUp, true);
  document.addEventListener("pointercancel", onPointerUp, true);
  window.addEventListener("pageshow", onPageShow);
  form.setAttribute("data-contact-ready", "");

  release = () => {
    form.removeEventListener("submit", onSubmit);
    form.removeEventListener("focusout", onFocusOut);
    form.removeEventListener("input", onInput);
    summary?.removeEventListener("click", onSummaryClick);
    document.removeEventListener("pointerdown", onPointerDown, true);
    document.removeEventListener("pointerup", onPointerUp, true);
    document.removeEventListener("pointercancel", onPointerUp, true);
    window.removeEventListener("pageshow", onPageShow);
    window.clearTimeout(remainingTimer);
    document.title = baseTitle;
    form.removeAttribute("data-contact-ready");
  };
}

function destroy() {
  release?.();
  release = null;
}

document.addEventListener("astro:page-load", init);
document.addEventListener("astro:before-swap", destroy);
// the module can arrive after astro:page-load has already fired for this page
init();
