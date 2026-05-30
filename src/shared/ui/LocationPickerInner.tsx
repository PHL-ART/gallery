"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Coords {
  lat: number;
  lon: number;
}

interface Props {
  initial?: Coords;
  onConfirm: (coords: Coords) => void;
  onCancel: () => void;
}

function makeIcon(color: string) {
  return L.divIcon({
    html: `<div style="width:14px;height:14px;background:${color};border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.6)"></div>`,
    className: "",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

export function LocationPickerInner({ initial, onConfirm, onCancel }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [coords, setCoords] = useState<Coords | null>(initial ?? null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const center: L.LatLngTuple = initial ? [initial.lat, initial.lon] : [20, 0];
    const zoom = initial ? 13 : 2;

    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    if (initial) {
      const marker = L.marker([initial.lat, initial.lon], {
        icon: makeIcon("oklch(0.55 0.22 25)"),
        draggable: true,
      }).addTo(map);

      marker.on("dragend", () => {
        const { lat, lng } = marker.getLatLng();
        setCoords({ lat, lon: lng });
      });

      markerRef.current = marker;
    }

    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        const marker = L.marker([lat, lng], {
          icon: makeIcon("oklch(0.55 0.22 25)"),
          draggable: true,
        }).addTo(map);

        marker.on("dragend", () => {
          const p = marker.getLatLng();
          setCoords({ lat: p.lat, lon: p.lng });
        });

        markerRef.current = marker;
      }

      setCoords({ lat, lon: lng });
    });

    mapRef.current = map;

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const btnBase =
    "font-mono text-[0.7rem] font-bold uppercase tracking-[0.12em] px-4 py-2 transition-colors duration-150";

  return (
    <div>
      <div
        ref={containerRef}
        style={{ height: 280 }}
        className="w-full"
      />
      <div className="flex items-center justify-between mt-3">
        <span className="font-mono text-[0.6rem] text-muted">
          {coords
            ? `${coords.lat.toFixed(5)}, ${coords.lon.toFixed(5)}`
            : "Click on the map to place a marker"}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className={`${btnBase} bg-panel-hi text-primary hover:bg-[var(--surface-hi)]`}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!coords}
            onClick={() => coords && onConfirm(coords)}
            className={`${btnBase} bg-[var(--text)] text-[var(--bg)] hover:bg-[var(--red)] hover:text-[oklch(0.97_0.006_25)] disabled:opacity-30`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
