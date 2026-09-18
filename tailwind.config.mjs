/** @type {import('tailwindcss').Config} */
// Colors per spec.md FR-042–FR-046 (Visual Identity Delta, 2026-09-17,
// derived from .specify/references/Orbolo_Editorial_Continuous.pdf): warm
// cream paper, forest-green ink (replacing near-black), sage for secondary/
// eyebrow/cursive-accent text, one earth accent for the single primary
// button per screen, deep muted green for Code marks/"verified by". All
// values pixel-sampled from the moodboard and WCAG-AA-verified — see
// plan.md's Design System section for the contrast table. No gradients,
// pastels, or shadows — hairline rules, flat surfaces.
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        paper: "#F8F4E9",
        ink: "#47592F",
        accent: "#B77B4A", // dry-grass ochre / Chaco clay — unchanged, no motivated replacement in the moodboard
        verified: "#2E3B20", // deep muted green — Code marks, "verified by"
        sage: "#6D7063", // secondary/eyebrow labels + cursive accent taglines (FR-045) — darkened from the sampled #A9AC9A to clear WCAG AA
      },
      fontFamily: {
        // Authoritative serif for headlines, clean grotesk for body/numbers
        // (brief §B1). Multi-word family names MUST be quoted — an unquoted
        // name containing a bare trailing digit (e.g. Source Serif 4) is
        // not a valid CSS <custom-ident>, which makes the whole
        // `font-family` declaration invalid and silently dropped by the
        // browser (discovered by inspecting the live parsed CSSOM, not
        // just the served CSS text, which still "looked" fine).
        display: ["Fraunces", '"Source Serif 4"', "Georgia", "serif"],
        body: ["Inter", '"IBM Plex Sans"', "Helvetica", "Arial", "sans-serif"],
        // FR-044: bold extended/wide grotesk for full-bleed statement
        // headlines over photography only — never body or nav. "Archivo
        // Expanded" is not a real family name (a direct Google Fonts API
        // request for it 400s) — this loads plain Archivo's variable wdth
        // axis at 125 (expanded) instead; the `font-stretch: expanded`
        // half of the effect is applied by the `.font-display-bold` rule
        // in global.css, since Tailwind's fontFamily key only emits
        // `font-family`, not `font-stretch`.
        "display-bold": ["Archivo", '"Arial Narrow"', "sans-serif"],
        // FR-045: cursive accent for short emotional taglines, at most one
        // per section — never body copy or functional UI text.
        accent: ["Caveat", '"Segoe Script"', "cursive"],
      },
    },
  },
  plugins: [],
};
