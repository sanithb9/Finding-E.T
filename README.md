# Finding E.T 🛸

A UFO/UAP and unidentified-object tracker. It does **not** detect anything
itself — it aggregates public data feeds, lets known/identified objects pass
through, and highlights the genuinely unexplained.

Built with Next.js (App Router) + TypeScript + Tailwind CSS. Deployed via
GitHub and Vercel.

## Roadmap

- ✅ **Phase 1 — Sightings Map**: dark space-themed homepage with an
  interactive Leaflet world map of sighting reports, date/country filters,
  and clickable report details. Ships with sample data modelled on NUFORC
  reports.
- ⬜ **Phase 2 — Space Watch**: near-Earth objects from NASA's NeoWs API,
  labelled Identified vs unusual, plus interstellar-object reference cards.
- ⬜ **Phase 3 — Latest Signals**: UAP news feed from RSS sources and
  official reports (AARO).
- ⬜ **Phase 4 — Alerts**: email alerts via Resend.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Where things live

- `app/` — the pages. `layout.tsx` is the shared frame (title, nav, footer);
  `page.tsx` is the homepage.
- `components/` — reusable building blocks: the map, the filter bar, and the
  explorer that wires them together.
- `lib/` — logic with no visuals: the `Sighting` type, filtering, and
  `getSightings()`, the single function to change when swapping in a live
  data source.
- `data/` — the bundled sample sightings dataset.

## Data sources

Phase 1 uses a bundled sample dataset in the style of NUFORC (National UFO
Reporting Center) reports, since NUFORC has no official public API. The data
layer (`lib/sightings.ts`) is the only file that needs to change to plug in a
live source. Map tiles: CARTO dark basemap © OpenStreetMap contributors.
