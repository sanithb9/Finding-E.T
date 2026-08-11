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

export interface SightingFilters {
  /** ISO date string; keep sightings on or after this date */
  dateFrom?: string;
  /** ISO date string; keep sightings on or before this date */
  dateTo?: string;
  /** Exact country name; "all" or undefined means no country filter */
  country?: string;
}
