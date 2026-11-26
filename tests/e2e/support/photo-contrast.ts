import type { Page } from "@playwright/test";

/**
 * Measures the contrast of every line of text that sits on a photo
 * (specs/005-contact-form — FR-IMG-008, research.md §25). Automated checkers
 * such as axe cannot judge text over an image, so this reads the pixels:
 *
 *  1. find each text node inside a photo shell (.phero with the nav above
 *     it, or .band) and take its line boxes, grown by 8 px;
 *  2. screenshot the shell with the text made transparent, so only the photo
 *     and the shade remain;
 *  3. for each line, take the lightest pixel behind it and compute the WCAG
 *     ratio against the text's own colour.
 *
 * With `whitePhotos`, the photo is swapped for pure white first. That is the
 * worst case for light text: passing it means the shade alone carries the
 * contrast, for any photo and at any point of the hero's drift.
 *
 * The page must be loaded with reduced motion, so nothing moves.
 */
export interface ContrastSample {
  shell: string;
  text: string;
  color: string;
  fontSize: number;
  fontWeight: number;
  /** WCAG 2.2 AA: 4.5, or 3 for large text (≥ 24 px, or ≥ 18.66 px and bold). */
  required: number;
  ratio: number;
  lightest: string;
}

interface Line {
  text: string;
  color: [number, number, number];
  fontSize: number;
  fontWeight: number;
  rects: Array<[number, number, number, number]>;
}

const HIDE_TEXT = `
  * { color: transparent !important; text-shadow: none !important; caret-color: transparent !important; }
  astro-dev-toolbar { display: none !important; }
`;
const WHITE_PHOTOS = `
  .phero, .band { background: #fff !important; }
  .phero__media, .band__bg { visibility: hidden !important; }
`;

export async function measureTextContrast(
  page: Page,
  options: { whitePhotos?: boolean } = {},
): Promise<ContrastSample[]> {
  await page.evaluate(() => document.fonts.ready);
  const shells = await page.locator(".phero, .band").all();
  const samples: ContrastSample[] = [];

  for (const [index, shell] of shells.entries()) {
    const isHero = await shell.evaluate((el) => el.classList.contains("phero"));
    const name = `${isHero ? "hero" : "band"} ${index + 1}`;

    // The nav is text over the photo only at the top of the page, over a hero.
    // Further down it has its own solid background, so over a band it is hidden here.
    await page.evaluate((hero) => {
      document.querySelector<HTMLElement>("[data-nav]")!.style.visibility = hero ? "" : "hidden";
    }, isHero);
    await shell.evaluate((el) => {
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
    });
    await page.waitForTimeout(150);
    // lazy photos must be on screen before they are measured
    await shell
      .locator("img[data-photo]")
      .first()
      .evaluate((img: HTMLImageElement) => img.decode().catch(() => undefined));

    const lines = await shell.evaluate((root, hero): Line[] => {
      const origin = root.getBoundingClientRect();
      const scopes: Element[] = hero ? [root, document.querySelector("[data-nav]")!] : [root];
      const out: Line[] = [];
      const rgb = (value: string) => (value.match(/[\d.]+/g) ?? []).map(Number);

      const ownsBackground = (el: Element | null, stop: Element): boolean => {
        for (let node = el; node && node !== stop; node = node.parentElement) {
          const [, , , alpha = 1] = rgb(getComputedStyle(node).backgroundColor);
          const hasColor = getComputedStyle(node).backgroundColor !== "rgba(0, 0, 0, 0)";
          // .flag, .card--glass and similar bring their own background: their pairing is not photo contrast
          if (hasColor && alpha >= 0.8) return true;
        }
        return false;
      };

      for (const scope of scopes) {
        const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          const text = (node.textContent ?? "").replace(/\s+/g, " ").trim();
          const parent = node.parentElement;
          if (!text || !parent) continue;
          const style = getComputedStyle(parent);
          if (style.visibility === "hidden" || Number(style.opacity) === 0) continue;
          if (parent.closest(".sr-only, script, style, [hidden]")) continue;
          if (ownsBackground(parent, scope)) continue;

          const range = document.createRange();
          range.selectNodeContents(node);
          const rects = [...range.getClientRects()]
            .filter((r) => r.width > 1 && r.height > 1)
            .map((r): [number, number, number, number] => [
              r.left - origin.left,
              r.top - origin.top,
              r.width,
              r.height,
            ]);
          if (rects.length === 0) continue;

          const [r, g, b] = rgb(style.color);
          out.push({
            text,
            color: [r, g, b],
            fontSize: parseFloat(style.fontSize),
            fontWeight: Number(style.fontWeight),
            rects,
          });
        }
      }
      return out;
    }, isHero);

    const style = await page.addStyleTag({
      content: HIDE_TEXT + (options.whitePhotos ? WHITE_PHOTOS : ""),
    });
    const png = await shell.screenshot({ scale: "css", animations: "disabled" });
    await style.evaluate((el) => el.remove());

    const measured = await page.evaluate(
      async ({ dataUrl, lines }) => {
        const image = new Image();
        image.src = dataUrl;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext("2d", { willReadFrequently: true })!;
        context.drawImage(image, 0, 0);

        const linear = (c: number) =>
          c / 255 <= 0.04045 ? c / 255 / 12.92 : ((c / 255 + 0.055) / 1.055) ** 2.4;
        const luminance = (r: number, g: number, b: number) =>
          0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
        const GROW = 8;

        return lines.map((line) => {
          let worst = -1;
          let lightest = "";
          for (const [x, y, w, h] of line.rects) {
            const left = Math.max(0, Math.floor(x - GROW));
            const top = Math.max(0, Math.floor(y - GROW));
            const right = Math.min(canvas.width, Math.ceil(x + w + GROW));
            const bottom = Math.min(canvas.height, Math.ceil(y + h + GROW));
            if (right <= left || bottom <= top) continue;
            const { data } = context.getImageData(left, top, right - left, bottom - top);
            for (let i = 0; i < data.length; i += 4) {
              const l = luminance(data[i], data[i + 1], data[i + 2]);
              if (l > worst) {
                worst = l;
                lightest = `rgb(${data[i]}, ${data[i + 1]}, ${data[i + 2]})`;
              }
            }
          }
          const textLuminance = luminance(...line.color);
          const ratio =
            worst < 0
              ? Infinity
              : (Math.max(textLuminance, worst) + 0.05) / (Math.min(textLuminance, worst) + 0.05);
          return { ratio: Math.round(ratio * 100) / 100, lightest };
        });
      },
      { dataUrl: `data:image/png;base64,${png.toString("base64")}`, lines },
    );

    lines.forEach((line, i) => {
      const large = line.fontSize >= 24 || (line.fontSize >= 18.66 && line.fontWeight >= 700);
      samples.push({
        shell: name,
        text: line.text.slice(0, 60),
        color: `rgb(${line.color.join(", ")})`,
        fontSize: Math.round(line.fontSize * 10) / 10,
        fontWeight: line.fontWeight,
        required: large ? 3 : 4.5,
        ratio: measured[i].ratio,
        lightest: measured[i].lightest,
      });
    });
  }

  await page.evaluate(() => {
    document.querySelector<HTMLElement>("[data-nav]")!.style.visibility = "";
    window.scrollTo(0, 0);
  });
  return samples;
}
