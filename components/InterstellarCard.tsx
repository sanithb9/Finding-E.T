import type { InterstellarObject } from "@/lib/types";

export default function InterstellarCard({ obj }: { obj: InterstellarObject }) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-accent/30 bg-panel/70 p-5">
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-mono text-lg font-semibold text-accent">
            {obj.nickname}
          </h3>
          <span className="shrink-0 rounded border border-fuchsia-400/50 bg-fuchsia-400/10 px-2 py-0.5 font-mono text-[10px] tracking-widest text-fuchsia-300">
            INTERSTELLAR
          </span>
        </div>
        <p className="font-mono text-xs tracking-wider text-muted">
          {obj.designation}
        </p>
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
        <dt className="text-muted">Discovered</dt>
        <dd>
          {obj.discovered} · {obj.discoveredBy}
        </dd>
        <dt className="text-muted">Nature</dt>
        <dd>{obj.classification}</dd>
        <dt className="text-muted">Speed</dt>
        <dd>~{obj.speedKps} km/s relative to the Sun</dd>
        <dt className="text-muted">Status</dt>
        <dd>{obj.status}</dd>
      </dl>

      <ul className="space-y-1.5 border-t border-panel-border pt-3 text-xs leading-relaxed text-foreground/85">
        {obj.facts.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="text-accent">✦</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
