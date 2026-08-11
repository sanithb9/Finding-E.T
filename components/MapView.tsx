"use client";

import { divIcon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { Sighting } from "@/lib/types";

// Pulsing teal beacon instead of Leaflet's default blue pin.
// divIcon lets us use plain HTML/CSS (see .uap-pin in globals.css).
const beaconIcon = divIcon({
  className: "",
  html: '<div class="uap-pin"><div class="uap-pin__ring"></div><div class="uap-pin__dot"></div></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -8],
});

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MapView({ sightings }: { sightings: Sighting[] }) {
  return (
    <MapContainer
      center={[25, 0]}
      zoom={2}
      minZoom={2}
      scrollWheelZoom
      worldCopyJump
      className="h-[55vh] min-h-[380px] w-full sm:h-[62vh]"
    >
      {/* Free dark basemap from CARTO on OpenStreetMap data — fits the space theme */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {sightings.map((s) => (
        <Marker key={s.id} position={[s.lat, s.lng]} icon={beaconIcon}>
          <Popup maxWidth={280}>
            <div className="space-y-1.5 text-sm">
              <p className="font-mono text-xs tracking-wider text-accent">
                {formatDate(s.date)} · {s.shape.toUpperCase()}
              </p>
              <p className="font-semibold">
                {s.city}
                {s.region ? `, ${s.region}` : ""} — {s.country}
              </p>
              <p className="text-foreground/90">{s.summary}</p>
              <p className="text-xs text-muted">
                Duration: {s.duration} · Source: {s.source}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
