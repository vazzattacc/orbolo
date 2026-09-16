import { getPublishedPaths } from "@/lib/paths/path-repository";
import { PathGrid } from "@/components/PathGrid";

// The site's first interaction is this path-selection screen instead of a
// conventional homepage (FR-001).
export default async function HomePage() {
  const paths = await getPublishedPaths();

  return (
    <>
      <a
        href="#path-grid"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-forest focus:px-4 focus:py-2 focus:text-cream"
      >
        Skip to paths
      </a>
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <header className="flex flex-col gap-3">
          <p className="font-accent text-lg italic text-forest/70">rooted in the land</p>
          <h1 className="font-body text-4xl font-bold tracking-widest2 text-forest sm:text-5xl">ORBOLO</h1>
          <p className="max-w-2xl font-body text-base text-forest/80 sm:text-lg">
            Beef, live cattle, and land stewardship from Paraguay. Choose the path into the
            Orbolo ecosystem that matches what you&apos;re looking for.
          </p>
        </header>

        <div id="path-grid">
          <PathGrid paths={paths} />
        </div>
      </main>
    </>
  );
}
