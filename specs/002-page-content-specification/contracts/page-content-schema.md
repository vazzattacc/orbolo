# Contract: Content Repository Functions

The interface every page component depends on. Mirrors `data-model.md`; this is the literal function-signature contract, the way `001-orbolo-path-selection`'s `getPaths()` is documented alongside `path-repository.ts`. Each function is the **sole** way its collection's data reaches a component — no component imports `astro:content` or a JSON file directly (Constitution Principle VIII).

## `getMetric(key: string): Promise<Metric | undefined>`

```ts
interface Metric {
  key: string;
  value: number | string;
  unit?: string;
  asOfDate: string; // ISO date
  sourceDocumentRef: string;
}

function getMetric(key: string): Promise<Metric | undefined>;
```

**Contract**: Returns `undefined` — never a partial object — if the entry is missing, or if `asOfDate` or `sourceDocumentRef` is empty/missing. A caller MUST treat `undefined` as "do not render this number," never substitute a placeholder value. This is the single enforcement point for `FR-GEN-005`.

## `getRanches(): Promise<RanchCard[]>`

```ts
function getRanches(): Promise<RanchCard[]>;
```

**Contract**: Returns `[]` when the collection is empty (true at launch). Callers (`DeploymentPipeline.astro`, `PartnerRanches.astro`) MUST render nothing when the array is empty — not a skeleton, not a "no ranches yet" message. Never returns a private-layer field (exact name, exact location, owner, contracts) — those don't exist in the schema at all, so there's nothing to accidentally leak.

## `getContractingEntityName(): Promise<string>`

```ts
function getContractingEntityName(): Promise<string>;
```

**Contract**: Returns the single `settings` entry's `contractingEntityName` field (`"Orbolo"`). Throws (fails the build) if the settings entry is missing — unlike `Metric`/`RanchCard`, this one is always expected to exist, since `FR-INV-012`'s footer line is not optional content.

## `getInvestPage(): Promise<InvestPage>`

## `getBeefPage(): Promise<BeefPage>`

## `getLandPage(): Promise<LandPage>`

```ts
function getInvestPage(): Promise<InvestPage>;
function getBeefPage(): Promise<BeefPage>;
function getLandPage(): Promise<LandPage>;
```

**Contract**: Each returns the single JSON object for its page, Zod-validated against the schema in `data-model.md`. Optional fields (per `data-model.md`'s "Required: no" rows) may be absent — their absence is what makes the corresponding component conditional (`{page.roadmap?.milestones?.length ? <Roadmap ... /> : null}`), per `contracts/nav-and-hidden-sections.md`. A required field missing fails Content Collections' own schema validation at build time — loud, not silent, matching the existing `paths` collection's behavior for a malformed entry.

## Compliance functions (reused, not new)

`FR-GEN-003` (banned words) and `FR-BEEF-010` ("regenerative") are enforced by **tests**, not a runtime function — there is no CMS-authored free text in this feature (every string is either a spec-derived constant in a JSON file or absent), so the compliance check is a Playwright/Vitest scan over the rendered page text (`tests/e2e/content-compliance.spec.ts`), not a `lib/` function every page must call. This differs from a CMS-driven project (where such a function guards arbitrary editor input) because there is no arbitrary editor input here — every word in these three pages' content JSON is either brief-sourced or Vaz-confirmed, checked once at authoring time and then guarded by the test suite against regression.
