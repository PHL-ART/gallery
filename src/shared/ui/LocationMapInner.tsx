"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  lat: number;
  lon: number;
}

export function LocationMapInner({ lat, lon }: Props) {
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

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    // Square brutalist marker — visible on dark monochrome tiles
    const icon = L.divIcon({
      html: `<div style="width:8px;height:8px;background:#fff;outline:2px solid rgba(255,255,255,0.25)"></div>`,
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
  }, [lat, lon]);

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
        style={{ height: 160, filter: "grayscale(1) brightness(0.75) contrast(1.15)" }}
        className="w-full pointer-events-none"
      />
    </a>
  );
}
