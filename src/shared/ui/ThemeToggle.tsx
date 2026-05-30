"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = (localStorage.getItem("ph1l74-theme") as Theme) || "dark";
    setTheme(saved);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("ph1l74-theme", next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.12em] text-muted hover-primary bg-transparent border-none cursor-pointer p-0 transition-colors duration-150 focus-red"
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
