/**
 * The replacement background photos (specs/005-contact-form, FR-IMG-001).
 * They live under src/ rather than public/ because Astro's image pipeline
 * only processes imported files: it turns each master into AVIF, WebP and
 * JPEG at several widths at build time (FR-IMG-006). This is a recorded
 * exception to the constitution's Assets line, for these photos only. The
 * kept photos stay in public/images/site/ and are passed as path strings.
 *
 * A master is a crop and resize of a Pexels original, nothing else
 * (FR-IMG-004). Sources and crop rectangles are recorded in
 * .specify/references/new-design/_IMAGES.md.
 *
 * `wide` is the landscape frame; `tall` is the portrait frame that phones
 * get, so they download only the part of the photo they show. Names describe
 * the picture, not the page, because one photo can fill several slots.
 * Stock photos: never caption or describe them as Orbolo's own animals or
 * ranches (FR-IMG-011).
 */
import type { ImageMetadata } from "astro";
import calvesSkyTall from "./calves-sky-tall.jpg";
import calvesSkyWide from "./calves-sky-wide.jpg";
import corralCowTall from "./corral-cow-tall.jpg";
import corralCowWide from "./corral-cow-wide.jpg";
import cowGrazingTall from "./cow-grazing-tall.jpg";
import cowGrazingWide from "./cow-grazing-wide.jpg";
import cowsBellsTall from "./cows-bells-tall.jpg";
import pastureHerdTall from "./pasture-herd-tall.jpg";
import pastureHerdWide from "./pasture-herd-wide.jpg";

export interface Photo {
  /** Stable name, rendered as data-photo; tests select photos by it. */
  name: string;
  wide?: ImageMetadata;
  tall?: ImageMetadata;
}

export const photos = {
  pastureHerd: { name: "pasture-herd", wide: pastureHerdWide, tall: pastureHerdTall },
  calvesSky: { name: "calves-sky", wide: calvesSkyWide, tall: calvesSkyTall },
  corralCow: { name: "corral-cow", wide: corralCowWide, tall: corralCowTall },
  cowsBells: { name: "cows-bells", tall: cowsBellsTall },
  cowGrazing: { name: "cow-grazing", wide: cowGrazingWide, tall: cowGrazingTall },
} satisfies Record<string, Photo>;
