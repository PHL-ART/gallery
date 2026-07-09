// src/shared/ui/LanguageSwitcher.tsx
"use client";

import { useLanguage } from "@/shared/providers/I18nProvider";
import type { Locale } from "@/shared/lib/i18n";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const toggle = () => {
    const next: Locale = lang === "en" ? "ru" : "en";
    setLang(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={`Switch language, current: ${lang.toUpperCase()}`}
      className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.12em] text-muted hover-primary bg-transparent border-none cursor-pointer p-0 transition-colors duration-150 focus-red"
    >
      {lang === "en" ? "RU" : "EN"}
    </button>
  );
}
