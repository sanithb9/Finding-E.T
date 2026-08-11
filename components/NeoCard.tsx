import type { NeoObject } from "@/lib/types";

function formatMetres(m: number): string {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export default function NeoCard({ neo }: { neo: NeoObject }) {
  const flagged = neo.flags.length > 0;

  return (
    <article
      className={`flex flex-col gap-3 rounded-lg border bg-panel/70 p-4 ${
        flagged ? "border-amber-500/50" : "border-panel-border"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-mono text-sm font-semibold tracking-wide">
          {neo.name}
        </h3>
        {flagged ? (
          <span className="shrink-0 rounded border border-amber-500/60 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] tracking-widest text-amber-400">
            FLAGGED
          </span>
        ) : (
          <span className="shrink-0 rounded border border-accent/40 bg-accent-soft px-2 py-0.5 font-mono text-[10px] tracking-widest text-accent">
            IDENTIFIED
          </span>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
        <dt className="text-muted">Closest approach</dt>
        <dd>{formatDate(neo.approachDate)}</dd>
        <dt className="text-muted">Miss distance</dt>
        <dd>
          {neo.missLunar.toFixed(1)} LD
          <span className="text-muted">
            {" "}
            · {Math.round(neo.missKm).toLocaleString("en-GB")} km
          </span>
        </dd>
        <dt className="text-muted">Est. diameter</dt>
        <dd>
          {formatMetres(neo.diameterMinM)}–{formatMetres(neo.diameterMaxM)}
        </dd>
        <dt className="text-muted">Speed</dt>
        <dd>{neo.velocityKps.toFixed(1)} km/s</dd>
      </dl>

      {flagged && (
        <ul className="space-y-1 border-t border-panel-border pt-2 text-xs text-amber-300/90">
          {neo.flags.map((f) => (
            <li key={f}>⚠ {f}</li>
          ))}
        </ul>
      )}

      <a
        href={neo.nasaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto font-mono text-[11px] tracking-wider text-muted transition-colors hover:text-accent"
      >
        NASA JPL DATA →
      </a>
    </article>
  );
}
