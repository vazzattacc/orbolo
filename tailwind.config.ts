import type { Config } from "tailwindcss";

// Design tokens extracted from the moodboard
// (.specify/references/Orbolo_Editorial_Continuous.pdf) per research.md §7,
// refined by the `image-to-code` skill pass (Constitution Principle X).
// The moodboard's flat UI palette is deliberately just two colors — cream
// and deep forest green; gold/sky/etc. tones only ever appear inside
// photography itself, never as flat fills, so they are intentionally NOT
// modeled as separate UI tokens here.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F4F0E6",
          50: "#FBFAF6",
          100: "#F4F0E6",
          200: "#EAE3D0",
        },
        forest: {
          DEFAULT: "#2E4034",
          50: "#3E5647",
          100: "#2E4034",
          200: "#1F2C24",
        },
      },
      fontFamily: {
        // Bold tracked sans — the ORBOLO wordmark and large statement type.
        body: ["var(--font-body)", "Helvetica", "Arial", "sans-serif"],
        // Tracked serif caps — used the way the moodboard sets place-name
        // captions (e.g. "HELIOS EXT ROSLINDALE"): for card/path titles.
        display: ["var(--font-display)", "Georgia", "serif"],
        // Italic serif — short accent taglines only ("rooted in the land").
        accent: ["var(--font-accent)", "Georgia", "serif"],
      },
      letterSpacing: {
        // Reserved for the single-word "ORBOLO" wordmark only.
        widest2: "0.2em",
        // Card/page titles: multi-word path names (e.g. "Ganadería a
        // Pasto") wrap awkwardly at widest2 — this keeps the tracked-serif
        // caps motif without forcing early line breaks.
        wide2: "0.06em",
      },
    },
  },
  plugins: [],
};

export default config;
