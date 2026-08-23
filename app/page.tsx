import SightingsExplorer from "@/components/SightingsExplorer";
import { getSightings } from "@/lib/sightings";

// Re-render at most every 30 minutes so new reports appear automatically
export const revalidate = 1800;

export default async function Home() {
  const sightings = await getSightings();

  return (
    <div className="space-y-5">
      <section>
        <h2 className="font-mono text-sm tracking-[0.3em] text-muted">
          PHASE 1 · SIGHTINGS MAP
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/80">
          The latest reports of unidentified objects, live from MUFON&apos;s
          worldwide reporting network and refreshed every half hour. Each
          beacon is one report — filter by date or country, and click a beacon
          to read what the witness described.
        </p>
      </section>

      <SightingsExplorer sightings={sightings} />
    </div>
  );
}
