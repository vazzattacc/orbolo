/**
 * Flip/disclosure interaction for PathCard (research.md §2, §6). A small
 * vanilla-TS script, not a mounted island framework, per FR-025.
 *
 * The server-rendered markup ships with NO tabindex overrides, so "Discover
 * more" is reachable by keyboard/AT even with this script disabled (FR-024).
 * When this script does run, it additionally manages tabindex so only the
 * currently visible face is in the tab order — a progressive enhancement,
 * not a requirement for baseline reachability.
 */
function initPathCard(card: HTMLElement) {
  const trigger = card.querySelector<HTMLButtonElement>("[data-path-card-trigger]");
  const back = card.querySelector<HTMLElement>("[data-path-card-back]");
  const discover = card.querySelector<HTMLAnchorElement>("[data-path-card-discover]");
  const close = card.querySelector<HTMLButtonElement>("[data-path-card-close]");

  if (!trigger || !back || !discover || !close) return;

  function setFlipped(flipped: boolean, focusTarget?: HTMLElement) {
    card.dataset.flipped = String(flipped);
    trigger!.setAttribute("aria-expanded", String(flipped));
    trigger!.tabIndex = flipped ? -1 : 0;
    discover!.tabIndex = flipped ? 0 : -1;
    close!.tabIndex = flipped ? 0 : -1;
    focusTarget?.focus();
  }

  // Enhanced initial state: hide the back face from the tab order until
  // flipped open (baseline no-JS markup leaves it reachable — see above).
  setFlipped(false);

  trigger.addEventListener("click", () => setFlipped(true, discover));
  close.addEventListener("click", () => setFlipped(false, trigger));

  card.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && card.dataset.flipped === "true") {
      setFlipped(false, trigger);
    }
  });

  // FR-005: clicking a flipped card anywhere other than "Discover more"
  // flips it back. Guards against the trigger's own click (which bubbles
  // here too) re-closing the card it just opened in the same event.
  card.addEventListener("click", (event) => {
    if (card.dataset.flipped !== "true") return;
    const target = event.target as HTMLElement;
    if (target.closest("[data-path-card-discover]")) return;
    if (target.closest("[data-path-card-close]")) return;
    if (target.closest("[data-path-card-trigger]")) return;
    setFlipped(false, trigger);
  });
}

// Astro's View Transitions router (<ClientRouter /> in Layout.astro) only
// executes a page's <script> tags on the very first load. Subsequent
// SPA-style navigations — including the browser Back button after
// "Discover more" — swap in a fresh DOM without re-running this script, so
// initPathCard must be re-invoked on Astro's own post-swap lifecycle event
// rather than only at module top-level.
document.addEventListener("astro:page-load", () => {
  document
    .querySelectorAll<HTMLElement>("[data-path-card]")
    .forEach(initPathCard);
});
