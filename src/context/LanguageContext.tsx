"use client";

// Client-side language provider. Owns locale state, persists preference to
// localStorage, and mutates <html lang> / dir / --font-sans whenever the locale
// changes. The data file itself is statically imported by the data hook — it
// is not held in context.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  DEFAULT_LOCALE,
  LOCALE_DIRECTION,
  isLocale,
  type Direction,
  type Locale,
} from "@/lib/i18n";

const STORAGE_KEY = "adham.locale";

// Snapshot the current persisted preference. Runs only in the browser; on the
// server it returns DEFAULT_LOCALE so server and the first client render are
// identical and no hydration warning fires on <html>.
function readStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return isLocale(saved) ? saved : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

// `useSyncExternalStore` callbacks — these must have stable identities.
function subscribe(_listener: () => void): () => void {
  // We only re-read on programmatic writes; the storage event also fires
  // across tabs which is a nice-to-have.
  if (typeof window === "undefined") return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) _listener();
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

function getSnapshot(): Locale {
  return readStoredLocale();
}

function getServerSnapshot(): Locale {
  // Server has no localStorage; always return the default so the first
  // client render matches the server-rendered HTML.
  return DEFAULT_LOCALE;
}

export interface LanguageContextValue {
  locale: Locale;
  direction: Direction;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Update DOM attributes + the active sans font when locale changes.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = LOCALE_DIRECTION[locale];
    root.style.setProperty(
      "--font-sans",
      locale === "fa" ? "var(--font-vazirmatn)" : "var(--font-geist-sans)",
    );
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage write failures; the in-memory state still updates.
    }
    // `storage` event doesn't fire in the originating tab, so dispatch one to
    // notify our own subscription.
    window.dispatchEvent(
      new StorageEvent("storage", { key: STORAGE_KEY, newValue: next }),
    );
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "en" ? "fa" : "en");
  }, [locale, setLocale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      direction: LOCALE_DIRECTION[locale],
      setLocale,
      toggleLocale,
    }),
    [locale, setLocale, toggleLocale],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
