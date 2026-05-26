"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  lat: number;
  lon: number;
  theme: "dark" | "light";
}

export function LocationMapInner({ lat, lon, theme }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lon],
      zoom: 13,
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      keyboard: false,
      attributionControl: false,
    });

    const tileUrl =
      theme === "dark"
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    L.tileLayer(tileUrl, { maxZoom: 19, subdomains: "abcd" }).addTo(map);

    const markerBg = theme === "dark" ? "#fff" : "oklch(0.48 0.20 25)";
    const markerOutline =
      theme === "dark" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.18)";

    const icon = L.divIcon({
      html: `<div style="width:8px;height:8px;background:${markerBg};outline:2px solid ${markerOutline}"></div>`,
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
      ? "grayscale(1) brightness(0.75) contrast(1.15)"
      : "grayscale(0.3) brightness(1.0) contrast(1.05)";

  return (
    <a
      href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=14/${lat}/${lon}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
      aria-label="Open location in OpenStreetMap"
    >
      <div
        ref={containerRef}
        style={{ height: 160, filter }}
        className="w-full pointer-events-none"
      />
    </a>
  );
}
