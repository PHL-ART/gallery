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

    const tileUrl =
      theme === "dark"
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    L.tileLayer(tileUrl, { maxZoom: 19, subdomains: "abcd" }).addTo(map);

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
      ? "brightness(0.8) contrast(1.1)"
      : "brightness(1.0) contrast(1.02)";

  return (
    <div>
      <div
        ref={containerRef}
        style={{ height: 200, filter }}
        className="w-full"
      />
      <a
        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=14/${lat}/${lon}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block font-mono text-[0.58rem] text-muted no-underline hover-primary transition-colors duration-150 mt-1 text-right"
        aria-label="Open location in OpenStreetMap"
      >
        Open in OpenStreetMap ↗
      </a>
    </div>
  );
}
