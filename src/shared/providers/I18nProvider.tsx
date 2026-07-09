// src/shared/providers/I18nProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getSetting, setSetting } from "@/shared/lib/settings";
import type { Locale } from "@/shared/lib/i18n";

import enMessages from "../../../messages/en.json";
import ruMessages from "../../../messages/ru.json";

const messages = { en: enMessages, ru: ruMessages };

// Контекст языка — позволяет LanguageSwitcher менять язык без перезагрузки страницы.
// Дефолтное значение `{ lang: "en", setLang: () => {} }` используется как fallback,
// если компонент используется вне I18nProvider (хотя в prod это не должно происходить).
const LanguageContext = createContext<{
  lang: Locale;
  setLang: (l: Locale) => void;
}>({ lang: "en", setLang: () => {} });

export function useLanguage() {
  return useContext(LanguageContext);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Начальное значение "en" совпадает с SSR-рендером на сервере.
  // Это критично для предотвращения hydration mismatch: на сервере нет доступа к localStorage,
  // поэтому мы всегда стартуем с "en", а затем обновляем в useEffect на клиенте.
  const [lang, setLangState] = useState<Locale>("en");

  useEffect(() => {
    // Читаем язык из localStorage только после гидратации, когда DOM стабилизирован.
    // Это гарантирует, что значение на клиенте совпадёт с сохранённым выбором пользователя.
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
