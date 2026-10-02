# Contract: Metadata Repository Functions

Mirrors `data-model.md`. Each function is the sole way its collection's data reaches a component (Constitution Principle VIII) — no component imports `astro:content` directly.

## `getPageMeta(route: string): Promise<PageMeta | undefined>`

```ts
interface PageMeta {
  route: string;
  description: string;
  indexable: boolean;
}

function getPageMeta(route: string): Promise<PageMeta | undefined>;
```

**Contract**: Looks up by `route` (not `id`), since callers have the route (`Astro.url.pathname`) readily available and shouldn't need to know the collection's internal id scheme. Returns `undefined` if no entry exists for that route — `Layout.astro` MUST still render a page in that case (never block rendering on missing metadata) but SHOULD surface the gap (e.g. a build-time warning), since every *shipped* page is expected to have an entry per `SC-002`.

Canonical URL is **not** returned by this function — compute it separately: `new URL(route, Astro.site).href`.

## `getNotFoundContent(): Promise<NotFoundContent>`

```ts
interface NotFoundContent {
  heading: string;
  body: string;
  homeLinkLabel: string;
}

function getNotFoundContent(): Promise<NotFoundContent>;
```

**Contract**: Always returns a value — throws (fails the build) if the single entry is missing, the same "always expected to exist" contract as `002`'s `getContractingEntityName()`. The 404 page cannot meaningfully render without this content.

## `getLegalDocument(kind: "privacy" | "terms"): Promise<LegalDocument | undefined>`

```ts
interface LegalDocument {
  sourceUrl: string;
  fetchedOn: string;
  sourceLastUpdated?: string;
  body: { heading: string; paragraphs: string[] }[];
  reviewNotes: string[];
}

function getLegalDocument(kind: "privacy" | "terms"): Promise<LegalDocument | undefined>;
```

**Contract**: Returns `undefined` when the entry doesn't exist (`FR-LEG-004`) **or** exists but `approved` is `false` (`FR-LEG-007`) — the `approved` flag itself is never exposed to callers, because there is nothing a caller should do with "approved: false" except treat it identically to "doesn't exist." This is the single gating point `research.md` §5 describes; `Footer.astro`, `privacy.astro`, and `terms.astro` all call this same function and never re-check `approved` themselves.

## `getSocialPreviewDefaults(): Promise<SocialPreviewDefaults>`

```ts
interface SocialPreviewDefaults {
  siteName: string;
  socialImagePath: string;
  socialImageAlt: string;
}

function getSocialPreviewDefaults(): Promise<SocialPreviewDefaults>;
```

**Contract**: A second, new function added alongside `002`'s existing `getContractingEntityName()` in `src/lib/settings/settings-repository.ts` — both read the same `settings` collection (schema extended with 3 new required fields), but `getContractingEntityName()` itself is **not modified, renamed, or touched**, so `002`'s `Closing.astro` call site needs zero changes. Throws if the settings entry is missing, same "always expected to exist" contract as its sibling.
