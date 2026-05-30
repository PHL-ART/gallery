"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { store } from "./index";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Stable reference — avoids re-creating store on each render
  const storeRef = useRef(store);
  return <Provider store={storeRef.current}>{children}</Provider>;
}
