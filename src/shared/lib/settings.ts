type Settings = {
  theme: "dark" | "light";
  lang: "en" | "ru";
};

// Ключи в localStorage — theme сохраняет совместимость с inline script в layout.tsx,
// который читает ph1l74-theme для предотвращения мерцания при загрузке страницы
const STORAGE_KEYS: Record<keyof Settings, string> = {
  theme: "ph1l74-theme",
  lang: "ph1l74-lang",
};

const DEFAULTS: Settings = {
  theme: "dark",
  lang: "en",
};

// Допустимые значения для каждого ключа настроек
const VALID_VALUES: Record<keyof Settings, readonly string[]> = {
  theme: ["dark", "light"],
  lang: ["en", "ru"],
};

// SSR-safe чтение: возвращает дефолт если window недоступен или значение некорректно.
// Проверка `typeof window === "undefined"` необходима, так как функция может вызваться
// на сервере при SSR или во время гидратации, когда DOM еще недоступен.
export function getSetting<K extends keyof Settings>(key: K): Settings[K] {
  if (typeof window === "undefined") return DEFAULTS[key];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[key]);
    if (raw !== null && (VALID_VALUES[key] as string[]).includes(raw)) {
      return raw as Settings[K];
    }
    return DEFAULTS[key];
  } catch {
    return DEFAULTS[key];
  }
}

// SSR-safe запись: безопасна для вызова на сервере (просто вернёт, ничего не делая)
export function setSetting<K extends keyof Settings>(key: K, value: Settings[K]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS[key], value);
  } catch {
    // localStorage недоступен (приватный режим браузера, sandboxed context и т.п.) — молча игнорируем.
    // Не выбрасываем ошибку, чтобы не прерывать пользовательский поток.
  }
}
