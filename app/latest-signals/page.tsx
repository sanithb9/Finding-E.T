import type { Metadata } from "next";
import SignalsList from "@/components/SignalsList";
import { getLatestSignals } from "@/lib/news";

export const metadata: Metadata = {
  title: "Latest Signals — Finding E.T",
  description:
    "A live feed of space and UAP-related news aggregated from public sources, with UAP-relevant stories flagged.",
};

// Refresh the aggregated feed every 30 minutes
export const revalidate = 1800;

// AARO publishes reports on its site but offers no RSS feed, so official
// sources are linked directly instead of aggregated.
const officialSources = [
  {
    name: "AARO",
    detail: "All-domain Anomaly Resolution Office — official UAP reports",
    url: "https://www.aaro.mil",
  },
  {
    name: "NASA UAP study",
    detail: "NASA's independent UAP study team and report",
    url: "https://science.nasa.gov/uap/",
  },
];

export default async function LatestSignals() {
  const feed = await getLatestSignals();

  return (
    <div className="space-y-6">
      <section>
        <h2 className="font-mono text-sm tracking-[0.3em] text-muted">
          PHASE 3 · LATEST SIGNALS
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/80">
          Recent headlines aggregated from public space-news feeds, refreshed
          every half hour. Stories mentioning UAPs, unidentified objects, or
          interstellar visitors are tagged as{" "}
          <span className="font-mono text-xs text-accent">UAP SIGNAL</span> —
          the rest pass through as background chatter.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {officialSources.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-panel-border bg-panel/70 p-4 transition-colors hover:border-accent/40"
          >
            <p className="font-mono text-xs tracking-widest text-accent">
              OFFICIAL SOURCE → {s.name}
            </p>
            <p className="mt-1 text-xs text-foreground/70">{s.detail}</p>
          </a>
        ))}
      </section>

      {feed.failedSources.length > 0 && (
        <p className="rounded-lg border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-xs text-amber-200/90">
          Some sources didn&apos;t respond this time and were skipped:{" "}
          {feed.failedSources.join(", ")}. They&apos;ll be retried on the next
          refresh.
        </p>
      )}

      <SignalsList items={feed.items} />
    </div>
  );
}
