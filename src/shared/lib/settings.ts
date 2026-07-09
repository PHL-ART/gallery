type Settings = {
  theme: "dark" | "light";
  lang: "en" | "ru";
};

// Ключи в localStorage — theme сохраняет совместимость с inline script в layout.tsx
const STORAGE_KEYS: Record<keyof Settings, string> = {
  theme: "ph1l74-theme",
  lang: "ph1l74-lang",
};

const DEFAULTS: Settings = {
  theme: "dark",
  lang: "en",
};

// SSR-safe чтение: возвращает дефолт если window недоступен или значение некорректно
export function getSetting<K extends keyof Settings>(key: K): Settings[K] {
  if (typeof window === "undefined") return DEFAULTS[key];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[key]);
    return (raw as Settings[K]) ?? DEFAULTS[key];
  } catch {
    return DEFAULTS[key];
  }
}

// SSR-safe запись
export function setSetting<K extends keyof Settings>(key: K, value: Settings[K]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS[key], value);
  } catch {
    // localStorage недоступен (приватный режим и т.п.) — молча игнорируем
  }
}
