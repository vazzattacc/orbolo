import rawPaths from "./paths.json";
import type { PathCard } from "./types";

const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const allPaths = rawPaths as PathCard[];

function isNonEmpty(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * A PathCard is "published" only when every field a card/destination needs to
 * render is present. Anything else is excluded entirely — never shown as a
 * placeholder card (spec FR-018, data-model.md "Derived state").
 */
function isPublished(path: PathCard): boolean {
  return (
    isNonEmpty(path.title) &&
    isNonEmpty(path.description) &&
    isNonEmpty(path.image?.src) &&
    isNonEmpty(path.image?.alt) &&
    isNonEmpty(path.destination)
  );
}

function assertValidId(path: PathCard): void {
  if (!ID_PATTERN.test(path.id)) {
    throw new Error(
      `Invalid PathCard id "${path.id}": ids must be kebab-case (e.g. "el-tapir").`,
    );
  }
}

function assertValidDestination(path: PathCard): void {
  const expected = `/paths/${path.id}`;
  if (path.destination !== expected) {
    throw new Error(
      `Invalid destination for PathCard "${path.id}": expected "${expected}", got "${path.destination}". ` +
        "Destinations are always internal routes derived from the id (FR-022) — they are never free-typed or external.",
    );
  }
}

function assertUniqueIds(paths: PathCard[]): void {
  const seen = new Set<string>();
  for (const path of paths) {
    if (seen.has(path.id)) {
      throw new Error(`Duplicate PathCard id "${path.id}" in paths.json.`);
    }
    seen.add(path.id);
  }
}

function sortByOrder(paths: PathCard[]): PathCard[] {
  return [...paths].sort((a, b) => {
    const orderA = a.order ?? Number.POSITIVE_INFINITY;
    const orderB = b.order ?? Number.POSITIVE_INFINITY;
    return orderA - orderB;
  });
}

function validateStructure(paths: PathCard[]): void {
  assertUniqueIds(paths);
  for (const path of paths) {
    assertValidId(path);
    if (isPublished(path)) {
      assertValidDestination(path);
    }
  }
}

validateStructure(allPaths);

/**
 * Returns every published PathCard (all required fields present), sorted by
 * `order` (entries without an explicit `order` sort after those that have
 * one, preserving declaration order among themselves).
 *
 * This is the only place in the codebase that reads paths.json — swapping
 * the JSON source for a Firebase-backed one later means editing only this
 * module's internals, never PathCard/PathGrid (FR-020, Constitution
 * Principle VIII).
 */
export async function getPublishedPaths(): Promise<PathCard[]> {
  return sortByOrder(allPaths.filter(isPublished));
}

/**
 * Returns the PathCard matching `id`, regardless of published/pending state.
 * Callers (the dynamic destination route) must treat a pending result as
 * "not found" — a pending path has no reachable public URL.
 */
export async function getPathById(id: string): Promise<PathCard | undefined> {
  return allPaths.find((path) => path.id === id);
}

/** Exposed for the destination route to distinguish "not found" from "pending". */
export function isPathPublished(path: PathCard): boolean {
  return isPublished(path);
}
