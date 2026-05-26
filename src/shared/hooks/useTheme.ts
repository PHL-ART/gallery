"use client";
import { useState, useEffect } from "react";

export function useTheme(): "dark" | "light" {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const getTheme = (): "dark" | "light" =>
      (document.documentElement.getAttribute("data-theme") as "dark" | "light") || "dark";

    setTheme(getTheme());

    const observer = new MutationObserver(() => setTheme(getTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}
