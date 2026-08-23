"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import FilterBar from "@/components/FilterBar";
import { filterSightings, uniqueCountries } from "@/lib/sightings";
import type { Sighting, SightingFilters } from "@/lib/types";

// Leaflet reads from `window`, which doesn't exist during server rendering,
// so the map is loaded on the client only. The placeholder keeps the layout
// from jumping while it loads.
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[55vh] min-h-[380px] w-full items-center justify-center sm:h-[62vh]">
      <p className="font-mono text-sm tracking-widest text-muted animate-pulse">
        SCANNING THE SKIES…
      </p>
    </div>
  ),
});

export default function SightingsExplorer({
  sightings,
}: {
  sightings: Sighting[];
}) {
  const [filters, setFilters] = useState<SightingFilters>({});

  const countries = useMemo(() => uniqueCountries(sightings), [sightings]);
  const visible = useMemo(
    () => filterSightings(sightings, filters),
    [sightings, filters]
  );

  return (
    <div className="space-y-4">
      <FilterBar
        countries={countries}
        filters={filters}
        onChange={setFilters}
        matchCount={visible.length}
        totalCount={sightings.length}
      />

      <div className="overflow-hidden rounded-lg border border-panel-border">
        <MapView sightings={visible} />
      </div>

      <p className="text-xs text-muted">
        Click a beacon for the report details. Live reports from MUFON (Mutual
        UFO Network) via UFO Stalker; if the live source is unreachable, a
        bundled sample dataset keeps the map running.
      </p>
    </div>
  );
}
