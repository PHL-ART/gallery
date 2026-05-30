"use client";
import dynamic from "next/dynamic";
import { useTheme } from "@/shared/hooks/useTheme";

interface Props {
  lat: number;
  lon: number;
}

const MapInner = dynamic<Props & { theme: "dark" | "light" }>(
  () => import("./LocationMapInner").then((m) => m.LocationMapInner),
  {
    ssr: false,
    loading: () => <div style={{ height: 160 }} className="w-full bg-panel-hi" />,
  }
);

export function LocationMap({ lat, lon }: Props) {
  const theme = useTheme();
  return <MapInner lat={lat} lon={lon} theme={theme} key={theme} />;
}
