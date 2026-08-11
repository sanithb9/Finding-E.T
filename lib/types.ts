// The shape of a single sighting report, modelled on NUFORC report fields.
// Any future live data source just needs to be mapped into this shape.
export interface Sighting {
  id: string;
  /** ISO date string, e.g. "2026-03-14" */
  date: string;
  city: string;
  /** State/province, when the reporting country uses one */
  region?: string;
  country: string;
  /** Shape the witness described: disk, triangle, light, orb, etc. */
  shape: string;
  /** Rough duration of the event, as reported */
  duration: string;
  /** Short witness summary of the event */
  summary: string;
  lat: number;
  lng: number;
  /** Where the report came from */
  source: string;
}

// A near-Earth object from NASA's NeoWs API, flattened to what the UI needs.
export interface NeoObject {
  id: string;
  name: string;
  /** ISO date of closest approach to Earth */
  approachDate: string;
  /** Human-readable approach time, e.g. "2026-Aug-11 10:57" (UTC) */
  approachTimeFull: string;
  /** Estimated diameter range in metres */
  diameterMinM: number;
  diameterMaxM: number;
  /** Speed relative to Earth in km/s */
  velocityKps: number;
  /** Closest distance in lunar distances (1 LD = Earth–Moon distance) */
  missLunar: number;
  missKm: number;
  /** NASA's "potentially hazardous asteroid" designation */
  hazardous: boolean;
  /** Why this object was flagged as notable; empty = ordinary */
  flags: string[];
  /** Link to NASA JPL's page for this object */
  nasaUrl: string;
}

// Static reference entry for a confirmed interstellar visitor.
export interface InterstellarObject {
  designation: string;
  nickname: string;
  discovered: string;
  discoveredBy: string;
  classification: string;
  speedKps: number;
  status: string;
  facts: string[];
}

// One item in the Latest Signals news feed, normalised from RSS.
export interface NewsItem {
  id: string;
  title: string;
  link: string;
  /** ISO datetime of publication */
  publishedAt: string;
  /** Plain-text summary, may be empty */
  summary: string;
  /** Which feed it came from, e.g. "The Debrief" */
  source: string;
  /** True when the title/summary matches UAP-related keywords */
  uapSignal: boolean;
}

export interface SightingFilters {
  /** ISO date string; keep sightings on or after this date */
  dateFrom?: string;
  /** ISO date string; keep sightings on or before this date */
  dateTo?: string;
  /** Exact country name; "all" or undefined means no country filter */
  country?: string;
}
