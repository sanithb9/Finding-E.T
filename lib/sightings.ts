import { sampleSightings } from "@/data/sample-sightings";
import type { Sighting, SightingFilters } from "@/lib/types";

// Data-access layer for sightings.
//
// Live source: UFO Stalker's public API, which tracks MUFON (Mutual UFO
// Network) reports in real time. NUFORC — the other big reporting centre —
// offers no API and blocks automated access, so MUFON is the live wire.
// If the API is unreachable, the bundled sample dataset keeps the map alive.

const API_BASE = "https://ufostalker.com/api/ufostalker/v1";
// The API caps page size at 50; two pages gives the ~100 latest reports.
const PAGES = [1, 2];
const PAGE_SIZE = 50;

interface RawStalkerSighting {
  id: string;
  approved: boolean;
  city: string | null;
  region: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  /** Epoch milliseconds of when the sighting occurred */
  occurred: number | null;
  shape: string | null;
  duration: string | null;
  summary: string | null;
  detailedDescription: string | null;
  source: string | null;
}

function toSighting(raw: RawStalkerSighting): Sighting | null {
  if (!raw.approved || !raw.latitude || !raw.longitude || !raw.occurred)
    return null;
  const summary = (raw.summary || raw.detailedDescription || "").trim();
  return {
    id: raw.id,
    date: new Date(raw.occurred).toISOString().slice(0, 10),
    city: raw.city?.trim() || "Unknown location",
    region: raw.region?.trim() || undefined,
    country: raw.country?.trim() || "Unknown",
    shape: raw.shape?.trim() || "Unknown",
    duration: raw.duration?.trim() || "Unknown",
    summary:
      summary.length > 240 ? `${summary.slice(0, 240).trimEnd()}…` : summary,
    lat: raw.latitude,
    lng: raw.longitude,
    source: "MUFON via UFO Stalker",
  };
}

export async function getSightings(): Promise<Sighting[]> {
  try {
    const pages = await Promise.all(
      PAGES.map(async (page) => {
        const res = await fetch(
          `${API_BASE}/sightings/by-page?page=${page}&size=${PAGE_SIZE}`,
          // Refresh the live feed every 30 minutes
          { next: { revalidate: 1800 } }
        );
        if (!res.ok) throw new Error(`UFO Stalker responded ${res.status}`);
        return (await res.json()) as RawStalkerSighting[];
      })
    );

    // Dedupe across pages (the API's page indexing has shifted before),
    // drop unusable records, newest first
    const seen = new Set<string>();
    const sightings = pages
      .flat()
      .map(toSighting)
      .filter((s): s is Sighting => {
        if (!s || seen.has(s.id)) return false;
        seen.add(s.id);
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));

    if (sightings.length === 0) throw new Error("no usable sightings");
    return sightings;
  } catch {
    // Live source down — fall back to the bundled sample so the map still works
    return [...sampleSightings].sort((a, b) => b.date.localeCompare(a.date));
  }
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
