import { sampleSightings } from "@/data/sample-sightings";
import type { Sighting, SightingFilters } from "@/lib/types";

// Data-access layer for sightings.
//
// Today this reads the bundled sample dataset. To go live later, replace the
// body of getSightings() with a fetch to a real source and map each record
// into the Sighting type — nothing else in the app has to change.
export async function getSightings(): Promise<Sighting[]> {
  // Newest reports first
  return [...sampleSightings].sort((a, b) => b.date.localeCompare(a.date));
}

// Pure filtering logic, shared by the map page. Kept separate from React so
// it can be unit-tested and reused server-side later (e.g. for email alerts).
export function filterSightings(
  sightings: Sighting[],
  filters: SightingFilters
): Sighting[] {
  return sightings.filter((s) => {
    if (filters.dateFrom && s.date < filters.dateFrom) return false;
    if (filters.dateTo && s.date > filters.dateTo) return false;
    if (
      filters.country &&
      filters.country !== "all" &&
      s.country !== filters.country
    )
      return false;
    return true;
  });
}

export function uniqueCountries(sightings: Sighting[]): string[] {
  return [...new Set(sightings.map((s) => s.country))].sort();
}
