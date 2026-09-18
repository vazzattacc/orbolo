// FR-032 / SC-005 — the brief's non-negotiable voice rules, enforced as code
// rather than trusted to proofreading (research.md §7).

export const BANNED_WORDS = [
  "sustainable",
  "holistic",
  "impact",
  "journey",
  "solution",
  "ecosystem",
  "unlock",
  "seamless",
  "leverage",
  "empower",
  "passionate",
  "premium",
] as const;

export interface ComplianceViolation {
  type: "banned-word" | "regenerative" | "guaranteed";
  match: string;
  context: string;
}

export interface ComplianceResult {
  passed: boolean;
  violations: ComplianceViolation[];
}

export interface ComplianceOptions {
  /** Pass "glossary" for the Glossary page, where "regenerative" is
   * expected as a defined term, not a claim about current product. */
  context?: "general" | "glossary";
}

function findAll(text: string, pattern: RegExp, type: ComplianceViolation["type"]): ComplianceViolation[] {
  const violations: ComplianceViolation[] = [];
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    const start = Math.max(0, index - 30);
    const end = Math.min(text.length, index + match[0].length + 30);
    violations.push({ type, match: match[0], context: text.slice(start, end).trim() });
  }
  return violations;
}

const NEGATIONS = ["not", "never", "no", "isn't", "aren't", "won't", "without"];

/**
 * FR-015 requires returns language to say "never guaranteed" — the
 * compliant phrasing itself contains the word. A blunt \bguaranteed\b ban
 * would flag the very sentence the brief requires, the same false-positive
 * shape as "regenerative" inside its Glossary explanation. This flags
 * "guaranteed" only when NOT preceded within 3 words by a negation.
 */
function findUnnegatedGuaranteed(text: string): ComplianceViolation[] {
  const violations: ComplianceViolation[] = [];
  for (const match of text.matchAll(/\bguaranteed\b/gi)) {
    const index = match.index ?? 0;
    const preceding = text
      .slice(Math.max(0, index - 40), index)
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .slice(-3);
    const isNegated = preceding.some((word) => NEGATIONS.includes(word.replace(/[.,;:!?]+$/, "")));
    if (isNegated) continue;
    const start = Math.max(0, index - 30);
    const end = Math.min(text.length, index + match[0].length + 30);
    violations.push({ type: "guaranteed", match: match[0], context: text.slice(start, end).trim() });
  }
  return violations;
}

/**
 * Scans a block of rendered/plain page text for the brief's non-negotiable
 * violations. Pure — no I/O — directly unit-testable.
 */
export function assertContentCompliance(renderedText: string, options: ComplianceOptions = {}): ComplianceResult {
  const violations: ComplianceViolation[] = [];

  // Brief §B2.6: the whole banned-word list (plus "regenerative") is banned
  // "outside the Glossary" — the Glossary is precisely where these terms get
  // defined/discussed, including technical proper-noun uses like "holistic
  // management" (research note: this also matches this feature's own Ranch
  // field `yearsInHolisticManagement`, so the Glossary carve-out isn't
  // cosmetic — non-Glossary pages genuinely need a different word).
  if (options.context !== "glossary") {
    for (const word of BANNED_WORDS) {
      violations.push(...findAll(renderedText, new RegExp(`\\b${word}\\b`, "gi"), "banned-word"));
    }
    violations.push(...findAll(renderedText, /\bregenerative\b/gi, "regenerative"));
  }

  // "guaranteed" is disallowed globally (not just "near returns language"),
  // EXCEPT when already negated ("never guaranteed") — that negated form is
  // the exact compliant phrasing FR-015 requires, not a violation of it.
  violations.push(...findUnnegatedGuaranteed(renderedText));

  return { passed: violations.length === 0, violations };
}
