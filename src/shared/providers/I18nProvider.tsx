// src/shared/providers/I18nProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getSetting, setSetting } from "@/shared/lib/settings";
import type { Locale } from "@/shared/lib/i18n";

import enMessages from "../../../messages/en.json";
import ruMessages from "../../../messages/ru.json";

const messages = { en: enMessages, ru: ruMessages };

// Контекст языка — позволяет LanguageSwitcher менять язык без перезагрузки страницы
const LanguageContext = createContext<{
  lang: Locale;
  setLang: (l: Locale) => void;
}>({ lang: "en", setLang: () => {} });

export function useLanguage() {
  return useContext(LanguageContext);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Начальное значение "en" совпадает с SSR — предотвращает hydration mismatch
  const [lang, setLangState] = useState<Locale>("en");

  useEffect(() => {
    // Читаем язык из localStorage только после гидратации
    setLangState(getSetting("lang"));
  }, []);

  const setLang = (next: Locale) => {
    setSetting("lang", next);
    setLangState(next);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <NextIntlClientProvider locale={lang} messages={messages[lang]}>
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
}
