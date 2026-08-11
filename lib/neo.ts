import type { NeoObject } from "@/lib/types";

// Data-access layer for NASA's NeoWs (Near Earth Object Web Service).
// https://api.nasa.gov — the free DEMO_KEY works out of the box but is
// rate-limited per IP; set NASA_API_KEY (locally in .env.local, on Vercel in
// Project Settings → Environment Variables) to lift the limit.

const FEED_URL = "https://api.nasa.gov/neo/rest/v1/feed";
const KM_PER_LUNAR_DISTANCE = 384_400;

// The "net": every NeoWs object is a catalogued, identified asteroid, but a
// few deserve attention. Each rule adds a human-readable flag.
function classify(o: {
  hazardous: boolean;
  missLunar: number;
  diameterMaxM: number;
  velocityKps: number;
}): string[] {
  const flags: string[] = [];
  if (o.hazardous) flags.push("Designated potentially hazardous by NASA");
  if (o.missLunar < 1)
    flags.push("Passes closer to Earth than the Moon's orbit");
  else if (o.missLunar < 5) flags.push("Very close approach (under 5 LD)");
  if (o.diameterMaxM > 1000) flags.push("Estimated diameter over 1 km");
  if (o.velocityKps > 30) flags.push("Unusually fast (over 30 km/s)");
  return flags;
}

interface RawNeo {
  id: string;
  name: string;
  nasa_jpl_url: string;
  is_potentially_hazardous_asteroid: boolean;
  estimated_diameter: {
    meters: { estimated_diameter_min: number; estimated_diameter_max: number };
  };
  close_approach_data: Array<{
    close_approach_date: string;
    close_approach_date_full: string;
    relative_velocity: { kilometers_per_second: string };
    miss_distance: { kilometers: string };
  }>;
}

export interface NeoFeed {
  objects: NeoObject[];
  /** Feed window, ISO dates */
  from: string;
  to: string;
  /** True when NASA could not be reached (e.g. rate limit) */
  unavailable: boolean;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// "(2014 QL433)" → "2014 QL433", but leave "1620 Geographos (1951 RA)" alone
function cleanName(name: string): string {
  return name.replace(/^\((.*)\)$/, "$1").trim();
}

// The same asteroid can appear under both its provisional designation
// ("2014 QL433") and its numbered one ("620082 (2014 QL433)") — key on the
// provisional designation so duplicates collapse.
function dedupeKey(name: string): string {
  const m = name.match(/\(([^)]+)\)\s*$/);
  return (m ? m[1] : name).trim();
}

export async function getUpcomingNeos(): Promise<NeoFeed> {
  const apiKey = process.env.NASA_API_KEY ?? "DEMO_KEY";
  const now = new Date();
  const from = isoDate(now);
  // NeoWs allows a window of at most 7 days per request
  const to = isoDate(new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000));

  try {
    const res = await fetch(
      `${FEED_URL}?start_date=${from}&end_date=${to}&api_key=${apiKey}`,
      // Cache the NASA response for an hour so visitors don't burn the
      // API rate limit — one upstream request per hour at most.
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`NeoWs responded ${res.status}`);
    const data = (await res.json()) as {
      near_earth_objects: Record<string, RawNeo[]>;
    };

    const seen = new Set<string>();
    const objects = Object.values(data.near_earth_objects)
      .flat()
      .filter((raw) => {
        const key = dedupeKey(raw.name);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((raw): NeoObject => {
        const approach = raw.close_approach_data[0];
        const missKm = Number(approach?.miss_distance.kilometers ?? 0);
        const base = {
          hazardous: raw.is_potentially_hazardous_asteroid,
          missLunar: missKm / KM_PER_LUNAR_DISTANCE,
          diameterMaxM:
            raw.estimated_diameter.meters.estimated_diameter_max,
          velocityKps: Number(
            approach?.relative_velocity.kilometers_per_second ?? 0
          ),
        };
        return {
          id: raw.id,
          name: cleanName(raw.name),
          approachDate: approach?.close_approach_date ?? from,
          approachTimeFull: approach?.close_approach_date_full ?? "",
          diameterMinM: raw.estimated_diameter.meters.estimated_diameter_min,
          diameterMaxM: base.diameterMaxM,
          velocityKps: base.velocityKps,
          missLunar: base.missLunar,
          missKm,
          hazardous: base.hazardous,
          flags: classify(base),
          nasaUrl: raw.nasa_jpl_url,
        };
      })
      // Flagged objects first, then soonest approach
      .sort(
        (a, b) =>
          (b.flags.length > 0 ? 1 : 0) - (a.flags.length > 0 ? 1 : 0) ||
          a.approachDate.localeCompare(b.approachDate) ||
          a.missLunar - b.missLunar
      );

    return { objects, from, to, unavailable: false };
  } catch {
    // NASA down or rate-limited — the page shows a friendly notice instead
    return { objects: [], from, to, unavailable: true };
  }
}
