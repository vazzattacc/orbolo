import type { PathCard as PathCardData } from "@/lib/paths/types";
import { PathCard } from "./PathCard";

export interface PathGridProps {
  paths: PathCardData[];
}

/**
 * Purely presentational: renders whatever published paths it's given, with
 * no data-fetching and no per-path branching of its own (FR-005, FR-006).
 * Responsive column counts live here — PathCard stays layout-agnostic.
 */
export function PathGrid({ paths }: PathGridProps) {
  if (paths.length === 0) {
    // No configured (published) paths — render nothing rather than a
    // placeholder or an error. A valid, if empty, state (FR-006 edge case).
    return null;
  }

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6"
    >
      {paths.map((path) => (
        <li key={path.id} className="min-h-[16rem] sm:min-h-[20rem]">
          <PathCard path={path} />
        </li>
      ))}
    </ul>
  );
}
