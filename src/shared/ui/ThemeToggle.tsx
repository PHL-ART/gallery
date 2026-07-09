"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getSetting, setSetting } from "@/shared/lib/settings";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const t = useTranslations("ui");

  useEffect(() => {
    const saved = getSetting("theme");
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    setSetting("theme", next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.12em] text-muted hover-primary bg-transparent border-none cursor-pointer p-0 transition-colors duration-150 focus-red"
    >
      {theme === "dark" ? t("themeLight") : t("themeDark")}
    </button>
  );
}
