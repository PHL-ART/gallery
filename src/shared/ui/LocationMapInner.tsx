"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  lat: number;
  lon: number;
  theme: "dark" | "light";
}

const RED_MARKER = "oklch(0.48 0.20 25)";

export function LocationMapInner({ lat, lon, theme }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lon],
      zoom: 13,
      zoomControl: true,
      dragging: true,
      scrollWheelZoom: false,
      doubleClickZoom: true,
      touchZoom: true,
      keyboard: false,
      attributionControl: false,
    });

    // OSM serves a single light tile set — the dark variant is produced by the
    // CSS filter below rather than by a separate tile URL.
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    const icon = L.divIcon({
      html: `<div style="width:8px;height:8px;background:${RED_MARKER};outline:2px solid rgba(0,0,0,0.22)"></div>`,
      className: "",
      iconSize: [8, 8],
      iconAnchor: [4, 4],
    });

    L.marker([lat, lon], { icon }).addTo(map);
    mapRef.current = map;

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [lat, lon, theme]);

  const filter =
    theme === "dark"
      ? "invert(1) hue-rotate(180deg) brightness(0.85) contrast(0.95) saturate(0.7)"
      : "brightness(1.0) contrast(1.02)";

  return (
    <div>
      <div
        ref={containerRef}
        style={{ height: 200, filter }}
        className={`w-full${theme === "dark" ? " map-dark-tiles" : ""}`}
      />
      <a
        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=14/${lat}/${lon}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block font-mono text-[0.58rem] text-muted no-underline hover-primary transition-colors duration-150 mt-1 text-right"
        aria-label="Open location in OpenStreetMap"
      >
        © OpenStreetMap contributors ↗
      </a>
    </div>
  );
}
