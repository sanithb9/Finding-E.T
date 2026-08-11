import SightingsExplorer from "@/components/SightingsExplorer";
import { getSightings } from "@/lib/sightings";

export default async function Home() {
  const sightings = await getSightings();

  return (
    <div className="space-y-5">
      <section>
        <h2 className="font-mono text-sm tracking-[0.3em] text-muted">
          PHASE 1 · SIGHTINGS MAP
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/80">
          Recent reports of unidentified objects from public sighting records.
          Each beacon is one report — filter by date or country, and click a
          beacon to read what the witness described.
        </p>
      </section>

      <SightingsExplorer sightings={sightings} />
    </div>
  );
}
