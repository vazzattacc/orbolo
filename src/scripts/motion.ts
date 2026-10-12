/**
 * Site-wide motion, modelled on the Orbolo preview site: Lenis smooth
 * scroll, random per-character heading reveals (GSAP SplitText), photos that
 * settle/parallax as they scroll, staggered entrances, a nav that steps out
 * of the way while reading, and the contact page's mouse trail.
 *
 * Everything here is progressive enhancement — markup is fully readable
 * without it. Reveals animate opacity only (never visibility/display), so
 * content stays in the accessibility tree and counts as visible before it
 * scrolls into view. prefers-reduced-motion skips smooth scroll, splits,
 * scrubs and entrances entirely.
 *
 * Astro's <ClientRouter /> swaps the page without reloading this module, so
 * per-page work lives in a gsap.context() built on astro:page-load and
 * reverted on astro:before-swap; Lenis is created once and kept.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let lenis: Lenis | null = null;

if (!reduce) {
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

let ctx: gsap.Context | null = null;
let splits: SplitText[] = [];
let teardown: Array<() => void> = [];

function initNav() {
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  if (!nav) return;
  let last = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    // hide while reading downward, return on any upward scroll
    nav.classList.toggle("is-hidden", !reduce && y > last && y > window.innerHeight * 0.6);
    last = y;
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  // keyboard users tabbing into the nav always get it back
  const onFocus = () => nav.classList.remove("is-hidden");
  nav.addEventListener("focusin", onFocus);
  teardown.push(() => {
    window.removeEventListener("scroll", onScroll);
    nav.removeEventListener("focusin", onFocus);
  });
}

function initAnchors() {
  if (!lenis) return;
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href")!;
    const el = id.length > 1 ? document.querySelector<HTMLElement>(id) : null;
    if (!el) return;
    e.preventDefault();
    lenis!.scrollTo(el, { duration: 1.4 });
    history.replaceState(null, "", id);
  };
  document.addEventListener("click", onClick);
  teardown.push(() => document.removeEventListener("click", onClick));
}

function initSplits() {
  document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
    el.classList.add("is-ready");
    if (reduce) return;
    const split = new SplitText(el, { type: "words, chars" });
    splits.push(split);
    gsap.set(split.chars, { opacity: 0 });
    gsap.to(split.chars, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
      stagger: { each: 0.02, from: "random" },
      delay: parseFloat(el.dataset.delay || "0"),
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });
}

function initScrollMotion() {
  if (reduce) return;

  // hero photo sinks and the copy lifts away as the page starts to scroll
  gsap.utils.toArray<HTMLElement>(".phero").forEach((hero) => {
    const media = hero.querySelector(".phero__media");
    const inner = hero.querySelector(".phero__inner");
    const st = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
    if (media) gsap.to(media, { yPercent: 18, ease: "none", scrollTrigger: st });
    if (inner) gsap.to(inner, { yPercent: -8, opacity: 0.2, ease: "none", scrollTrigger: st });
  });

  // split photos settle from a slight zoom as they pass through
  gsap.utils.toArray<HTMLElement>(".split__media img").forEach((img) => {
    gsap.fromTo(img, { scale: 1.12 }, {
      scale: 1, ease: "none",
      scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  // full-bleed bands drift against the scroll
  gsap.utils.toArray<HTMLElement>(".band").forEach((band) => {
    const bg = band.querySelector(".band__bg");
    if (bg) gsap.fromTo(bg, { yPercent: 6 }, {
      yPercent: -6, ease: "none",
      scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  // groups: children rise in one after another
  gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
    gsap.from(group.children, {
      y: 60, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: group, start: "top 85%", once: true },
    });
  });

  // single blocks
  gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      y: 30, opacity: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  // CTA collage pieces drop into place
  gsap.utils.toArray<HTMLElement>(".cta").forEach((cta) => {
    const pieces = cta.querySelectorAll(".cta__collage > *");
    if (pieces.length) gsap.from(pieces, {
      y: 60, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: cta, start: "top 75%", once: true },
    });
  });
}

// ---------- contact page: a 5vw grid over the photo; the square under the
// cursor lights up and fades; colour runs lime → olive → deep forest ----------
const TRAIL = { size: 5, fadeIn: 100, hold: 300, fadeOut: 300,
  stops: [[0, [191, 213, 93]], [0.43, [128, 148, 62]], [0.97, [38, 53, 24]]] as Array<[number, number[]]> };

function trailColour(t: number) {
  const s = TRAIL.stops;
  if (t <= s[0][0]) return s[0][1];
  for (let i = 1; i < s.length; i++) {
    if (t <= s[i][0]) {
      const k = (t - s[i - 1][0]) / (s[i][0] - s[i - 1][0]);
      return s[i - 1][1].map((c, n) => Math.round(c + (s[i][1][n] - c) * k));
    }
  }
  return s[s.length - 1][1];
}

function buildTrail(section: HTMLElement) {
  section.querySelector(".trail")?.remove();
  section.onmousemove = null;
  const fine = matchMedia("(pointer: fine)").matches && innerWidth >= 768;
  if (!fine || reduce) return;
  const px = (TRAIL.size * innerWidth) / 100;
  const cols = Math.ceil(section.offsetWidth / px);
  const rows = Math.ceil(section.offsetHeight / px);
  const layer = document.createElement("div");
  layer.className = "trail";
  layer.setAttribute("aria-hidden", "true");
  const cells: HTMLElement[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const el = document.createElement("i");
    el.style.cssText = `left:${c * TRAIL.size}vw;top:${r * TRAIL.size}vw;background:rgb(${trailColour(cols > 1 ? c / (cols - 1) : 0)})`;
    layer.appendChild(el);
    cells.push(el);
  }
  // under the text: right after the photo shade
  section.querySelector(".phero__shade")?.after(layer);
  const timers = new Map<number, number>();
  const off = (i: number) => { cells[i].style.transitionDuration = TRAIL.fadeOut + "ms"; cells[i].style.opacity = "0"; timers.delete(i); };
  section.onmousemove = (e) => {
    const b = section.getBoundingClientRect();
    const c = Math.floor((e.clientX - b.left) / px);
    const r = Math.floor((e.clientY - b.top) / px);
    if (c < 0 || r < 0 || c >= cols || r >= rows) return;
    const i = r * cols + c;
    clearTimeout(timers.get(i));
    cells[i].style.transitionDuration = TRAIL.fadeIn + "ms";
    cells[i].style.opacity = "1";
    timers.set(i, window.setTimeout(() => off(i), TRAIL.hold));
  };
}

function initTrail() {
  document.querySelectorAll<HTMLElement>("[data-trail]").forEach((section) => {
    buildTrail(section);
    let t: number;
    const onResize = () => { clearTimeout(t); t = window.setTimeout(() => buildTrail(section), 250); };
    window.addEventListener("resize", onResize);
    teardown.push(() => window.removeEventListener("resize", onResize));
  });
}

function init() {
  document.documentElement.classList.add("js");
  if (lenis) {
    lenis.start();
    lenis.resize();
    const target = location.hash.length > 1 ? document.querySelector<HTMLElement>(location.hash) : null;
    lenis.scrollTo(target ?? window.scrollY, { immediate: true, force: true });
  }
  initNav();
  initAnchors();
  initTrail();
  ctx = gsap.context(() => {
    initScrollMotion();
  });
  document.fonts.ready.then(() => {
    ctx?.add(() => initSplits());
    ScrollTrigger.refresh();
  });
}

function destroy() {
  // halt any smooth scroll still in flight so it can't carry over onto the
  // next page; the router then sets the new page's scroll position itself
  lenis?.stop();
  teardown.forEach((fn) => fn());
  teardown = [];
  splits.forEach((s) => s.revert());
  splits = [];
  ctx?.revert();
  ctx = null;
}

document.addEventListener("astro:page-load", init);
document.addEventListener("astro:before-swap", destroy);
// the new document's <html> replaces our classes on swap; put them back
document.addEventListener("astro:after-swap", () => {
  document.documentElement.classList.add("js");
});
