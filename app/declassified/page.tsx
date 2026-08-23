import type { Metadata } from "next";
import SignalsList from "@/components/SignalsList";
import { getDeclassifiedReleases } from "@/lib/declassified";

export const metadata: Metadata = {
  title: "Declassified — Finding E.T",
  description:
    "Recently released US government records tracked via FOIA archives, with UAP-related releases tagged, plus links to official declassified collections.",
};

// Refresh the release feed every 30 minutes
export const revalidate = 1800;

// Official US government collections — none of these publish RSS feeds,
// so they are linked directly rather than aggregated.
const officialCollections = [
  {
    name: "AARO",
    detail:
      "All-domain Anomaly Resolution Office — official UAP reports and resolved-case documentation",
    url: "https://www.aaro.mil",
  },
  {
    name: "National Archives",
    detail: "The US government's UAP Records Collection, established by law",
    url: "https://www.archives.gov/research/topics/uaps",
  },
  {
    name: "CIA Reading Room",
    detail: "The CIA's declassified UFO document collection under FOIA",
    url: "https://www.cia.gov/readingroom/collection/ufos",
  },
];

export default async function Declassified() {
  const feed = await getDeclassifiedReleases();

  return (
    <div className="space-y-6">
      <section>
        <h2 className="font-mono text-sm tracking-[0.3em] text-muted">
          DECLASSIFIED · US RECORDS
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/80">
          Newly released US government records, refreshed every half hour. The
          live feed tracks The Black Vault, the largest civilian archive of
          documents pried loose under the Freedom of Information Act — releases
          touching UAPs are tagged{" "}
          <span className="font-mono text-xs text-accent">UAP SIGNAL</span>.
          Official collections below release documents on their own schedule
          and are worth checking directly.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {officialCollections.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-panel-border bg-panel/70 p-4 transition-colors hover:border-accent/40"
          >
            <p className="font-mono text-xs tracking-widest text-accent">
              OFFICIAL → {s.name}
            </p>
            <p className="mt-1 text-xs text-foreground/70">{s.detail}</p>
          </a>
        ))}
      </section>

      {feed.failedSources.length > 0 && (
        <p className="rounded-lg border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-xs text-amber-200/90">
          The release feed didn&apos;t respond this time (
          {feed.failedSources.join(", ")}). It will be retried on the next
          refresh — the official collections above are always available.
        </p>
      )}

      <SignalsList
        items={feed.items}
        toggleLabel="UAP-related releases only"
        emptyMessage="No UAP-tagged releases in the current window. Untick the filter to see all recent document releases."
      />
    </div>
  );
}
