# Contract: Content data-access layer

**Module**: `lib/content/*` | **Consumers**: every Astro page/layout

Mirrors `001-orbolo-path-selection`'s `PathRepository` isolation pattern (constitution Principle VIII): page templates never import Keystatic's reader or raw content-collection entries directly — they call these typed accessors.

## `getPage(slug: string, locale: Locale): Promise<Page | undefined>`

Returns the page for `slug`+`locale` **only if** `status === "published"` for that locale; otherwise falls back to the default locale's published version and flags `isFallback: true` on the result, per FR-003/edge case ("never present a draft translation as finished"). Never returns a `draft` document for the requested locale.

## `getMetricValue(key: string): Promise<{ value, unit, asOfDate, source, label } | undefined>`

Returns `undefined` — not a partially-filled object — if `asOfDate` or `source` is missing on the underlying Metric (FR-031). Callers MUST treat `undefined` as "omit this number from the render", never as an error to surface to the visitor.

## `getPublishedRanches(): Promise<RanchView[]>`

Returns every Ranch with computed fields applied (see `computeRanchStatus` below), each shaped as the **public** view — private-layer fields (`exactName`, `exactLocation`, `owner`, `contracts`, `pastureAssessment`, `waterInfrastructure`, `vetHistory`, `visitBooking`) are never included in this function's return type, structurally (not just by convention) preventing a page template from accidentally rendering them (FR-014).

```ts
interface RanchView {
  codename: string;
  region: string;
  hectares: number;
  system: string;
  yearsInHolisticManagement: number;
  mpcsStatus: "member" | "in transition" | "not yet";
  checklist: ChecklistFlags;
  threshold: number;
  committedUnderLoi: number;       // computed, see below
  status: RanchStatus;              // computed, see below
  cycleLength: string;
  opensDate: string;
  updatedDate: string;
  photos?: string[];                // only if ownerConsent.photographed
  displayName?: string;             // codename, or exactName only if ownerConsent.named
}
```

## `computeRanchStatus(ranch: RanchRecord, activeLois: LoiRecord[], now: Date): { committedUnderLoi: number; status: RanchStatus }`

Pure function, unit-tested exhaustively. Rules (FR-009–FR-013):

1. `committedUnderLoi` = sum of `headCount` for every LOI where `ranch === this ranch`, `status !== "expired"`, and `now <= expiryDate` (an LOI past its 90-day expiry is excluded even if its stored `status` field hasn't been batch-updated yet — expiry is computed live, not just at write time).
2. `status` progression is monotonic per the sequence `Planned → Due diligence → Open for LOI → Released → Filling → Full → Deployed`; this function only computes the LOI-driven transitions (`Open for LOI` → `Released` at `committedUnderLoi / threshold >= 0.6`; `Released` → `Filling` as it grows; `Filling` → `Full` at 100%). `Planned`, `Due diligence`, and `Deployed` are operational/manual states set by the content editor (due diligence completion and physical deployment aren't derivable from LOI math) and are passed through unchanged by this function.
3. Once `Released` (60%+), the function never demotes a ranch back below `Released` even if `committedUnderLoi` later dips (e.g. an LOI expires post-release) — re-opening capital calls after release is a manual/business decision, not an automatic downgrade (this matches the brief's "no capital called before release... keeps filling to 100%" framing, which describes forward progress, not automatic reversal).

## `getGlossaryTerm(term: string): Promise<Term | undefined>`

Used by the site-wide tooltip mechanism (FR-024). Case-insensitive lookup.

## `assertContentCompliance(renderedText: string): ComplianceResult`

Build-time/CI check (research.md §7): scans rendered page text for the banned-word list, "regenerative" outside Glossary-context markup, and "guaranteed" in returns-language context. Returns violations with page slug + locale for CI to fail on (FR-032, SC-005).
