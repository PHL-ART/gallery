"use client";
import dynamic from "next/dynamic";

interface Coords {
  lat: number;
  lon: number;
}

interface Props {
  initial?: Coords;
  onConfirm: (coords: Coords) => void;
  onCancel: () => void;
}

const PickerInner = dynamic<Props>(
  () => import("./LocationPickerInner").then((m) => m.LocationPickerInner),
  {
    ssr: false,
    loading: () => (
      <div style={{ height: 280 }} className="w-full bg-panel-hi animate-pulse" />
    ),
  }
);

export function LocationPicker(props: Props) {
  return <PickerInner {...props} />;
}
