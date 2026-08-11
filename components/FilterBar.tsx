"use client";

import type { SightingFilters } from "@/lib/types";

interface FilterBarProps {
  countries: string[];
  filters: SightingFilters;
  onChange: (filters: SightingFilters) => void;
  matchCount: number;
  totalCount: number;
}

const inputClasses =
  "rounded-md border border-panel-border bg-panel px-3 py-2 text-sm text-foreground " +
  "focus:border-accent focus:outline-none [color-scheme:dark]";

export default function FilterBar({
  countries,
  filters,
  onChange,
  matchCount,
  totalCount,
}: FilterBarProps) {
  const isFiltered = Boolean(
    filters.dateFrom || filters.dateTo || (filters.country && filters.country !== "all")
  );

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border border-panel-border bg-panel/70 p-4">
      <label className="flex flex-col gap-1 text-xs font-mono tracking-wider text-muted">
        FROM
        <input
          type="date"
          className={inputClasses}
          value={filters.dateFrom ?? ""}
          onChange={(e) => onChange({ ...filters, dateFrom: e.target.value || undefined })}
        />
      </label>

      <label className="flex flex-col gap-1 text-xs font-mono tracking-wider text-muted">
        TO
        <input
          type="date"
          className={inputClasses}
          value={filters.dateTo ?? ""}
          onChange={(e) => onChange({ ...filters, dateTo: e.target.value || undefined })}
        />
      </label>

      <label className="flex flex-col gap-1 text-xs font-mono tracking-wider text-muted">
        COUNTRY
        <select
          className={inputClasses}
          value={filters.country ?? "all"}
          onChange={(e) => onChange({ ...filters, country: e.target.value })}
        >
          <option value="all">All countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      {isFiltered && (
        <button
          type="button"
          onClick={() => onChange({})}
          className="rounded-md border border-panel-border px-3 py-2 text-sm text-muted hover:border-accent hover:text-accent"
        >
          Clear
        </button>
      )}

      <p className="ml-auto font-mono text-xs tracking-wider text-accent">
        {matchCount} / {totalCount} SIGNALS
      </p>
    </div>
  );
}
