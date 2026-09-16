import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPathById, isPathPublished } from "@/lib/paths/path-repository";

interface DestinationPageProps {
  params: Promise<{ pathId: string }>;
}

// A single dynamic route serves every path's destination: adding or
// finishing a path in paths.json needs no new route file (FR-006, FR-013).
// This is a shared, generic template — no branch here is specific to any
// individual path (FR-005).
export default async function DestinationPage({ params }: DestinationPageProps) {
  const { pathId } = await params;
  const path = await getPathById(pathId);

  // A pending path has no reachable public URL — treated the same as "not
  // found" so an unfinished entry (e.g. business-meat) can't be reached by
  // guessing its URL (FR-018).
  if (!path || !isPathPublished(path)) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <Link href="/" className="w-fit font-body text-sm text-forest/70 underline underline-offset-4 hover:text-forest">
        ← Back to all paths
      </Link>

      <div className="relative aspect-[4/3] w-full overflow-hidden border border-forest/20">
        <Image src={path.image.src} alt={path.image.alt} fill className="object-cover" priority />
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="font-display text-4xl tracking-wide2 text-forest sm:text-5xl">{path.title}</h1>
        <p className="font-body text-lg text-forest/90">{path.description}</p>
        {path.longDescription ? (
          <p className="max-w-prose font-body text-base text-forest/75">{path.longDescription}</p>
        ) : null}
      </div>
    </main>
  );
}
