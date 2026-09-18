export interface RoadmapMilestoneView {
  title: string;
  stage: "now" | "building" | "target";
  targetDate: string;
  doneDate?: string;
  status: "planned" | "in-progress" | "done";
}

export async function getMilestonesBySlug(slugs: string[]): Promise<RoadmapMilestoneView[]> {
  const { getCollection } = await import("astro:content");
  const all = await getCollection("roadmapMilestones");
  return slugs
    .map((slug) => all.find((entry) => entry.id === slug)?.data)
    .filter((milestone): milestone is RoadmapMilestoneView => Boolean(milestone));
}
