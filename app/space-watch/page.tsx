import type { Metadata } from "next";
import InterstellarCard from "@/components/InterstellarCard";
import NeoCard from "@/components/NeoCard";
import { interstellarObjects } from "@/data/interstellar";
import { getUpcomingNeos } from "@/lib/neo";

export const metadata: Metadata = {
  title: "Space Watch — Finding E.T",
  description:
    "Near-Earth objects approaching this week, from NASA's NeoWs API, plus the confirmed interstellar visitors.",
};

// Re-render at most once an hour so the feed window and NASA data stay fresh
// without hammering the API.
export const revalidate = 3600;

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export default async function SpaceWatch() {
  const feed = await getUpcomingNeos();
  const flaggedCount = feed.objects.filter((o) => o.flags.length > 0).length;

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-mono text-sm tracking-[0.3em] text-muted">
          PHASE 2 · SPACE WATCH
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/80">
          Every object below is a known, catalogued asteroid tracked by NASA —
          that&apos;s the point. The net lets the identified pass through
          quietly and flags the ones worth a second look: unusually close,
          unusually large, unusually fast, or officially designated hazardous.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-mono text-base font-semibold tracking-wider">
            NEAR-EARTH OBJECTS · {formatDate(feed.from)} – {formatDate(feed.to)}
          </h3>
          {!feed.unavailable && (
            <p className="font-mono text-xs tracking-wider text-accent">
              {feed.objects.length} TRACKED · {flaggedCount} FLAGGED
            </p>
          )}
        </div>

        {feed.unavailable ? (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-6 text-sm text-amber-200/90">
            NASA&apos;s NeoWs feed is unreachable right now — likely the shared
            demo API key hit its hourly limit. The feed refreshes
            automatically; check back shortly.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {feed.objects.map((neo) => (
              <NeoCard key={neo.id} neo={neo} />
            ))}
          </div>
        )}

        <p className="text-xs text-muted">
          Live data from NASA&apos;s Near Earth Object Web Service (NeoWs),
          refreshed hourly. 1 LD = one lunar distance, the ~384,400 km between
          Earth and the Moon.
        </p>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="font-mono text-base font-semibold tracking-wider">
            INTERSTELLAR VISITORS
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-foreground/80">
            Only three objects have ever been confirmed to enter our solar
            system from interstellar space. Reference cards — the watchlist for
            visitor number four.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {interstellarObjects.map((obj) => (
            <InterstellarCard key={obj.designation} obj={obj} />
          ))}
        </div>
      </section>
    </div>
  );
}
