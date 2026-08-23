"use client";

import { useState } from "react";
import type { NewsItem } from "@/lib/types";

function formatWhen(iso: string): string {
  const then = new Date(iso);
  const hours = (Date.now() - then.getTime()) / 3_600_000;
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))} min ago`;
  if (hours < 24) return `${Math.round(hours)} h ago`;
  return then.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface SignalsListProps {
  items: NewsItem[];
  toggleLabel?: string;
  emptyMessage?: string;
}

export default function SignalsList({
  items,
  toggleLabel = "UAP signals only",
  emptyMessage = "No UAP-tagged items in the current feed window — the sky is quiet. Untick the filter to see all items.",
}: SignalsListProps) {
  const [signalsOnly, setSignalsOnly] = useState(false);

  const visible = signalsOnly ? items.filter((i) => i.uapSignal) : items;
  const signalCount = items.filter((i) => i.uapSignal).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-panel-border bg-panel/70 px-4 py-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={signalsOnly}
            onChange={(e) => setSignalsOnly(e.target.checked)}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          {toggleLabel}
        </label>
        <p className="font-mono text-xs tracking-wider text-accent">
          {visible.length} SHOWN · {signalCount} SIGNALS
        </p>
      </div>

      <ol className="space-y-3">
        {visible.map((item) => (
          <li key={item.id}>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`block rounded-lg border bg-panel/70 p-4 transition-colors hover:bg-panel ${
                item.uapSignal
                  ? "border-accent/40 border-l-4 border-l-accent"
                  : "border-panel-border"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-wider">
                <span className="text-muted">{formatWhen(item.publishedAt)}</span>
                <span className="rounded border border-panel-border px-1.5 py-0.5 text-muted">
                  {item.source.toUpperCase()}
                </span>
                {item.uapSignal && (
                  <span className="rounded border border-accent/40 bg-accent-soft px-1.5 py-0.5 text-accent">
                    UAP SIGNAL
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-sm font-semibold leading-snug">
                {item.title}
              </h3>
              {item.summary && (
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-foreground/70">
                  {item.summary}
                </p>
              )}
            </a>
          </li>
        ))}
      </ol>

      {visible.length === 0 && (
        <p className="rounded-lg border border-panel-border bg-panel/70 p-6 text-center text-sm text-muted">
          {emptyMessage}
        </p>
      )}
    </div>
  );
}
