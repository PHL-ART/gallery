"use client";
import dynamic from "next/dynamic";

interface Props {
  lat: number;
  lon: number;
}

const MapInner = dynamic<Props>(
  () => import("./LocationMapInner").then((m) => m.LocationMapInner),
  {
    ssr: false,
    loading: () => <div style={{ height: 160 }} className="w-full bg-panel-hi" />,
  }
);

export function LocationMap(props: Props) {
  return <MapInner {...props} />;
}
