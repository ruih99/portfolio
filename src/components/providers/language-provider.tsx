"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

type Locale = "ja" | "en";

interface LanguageState {
  locale: Locale;
  isHydrated: boolean;
}

interface LanguageContextValue {
  locale: Locale;
  toggleLanguage: () => void;
  isHydrated: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "portfolio-language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LanguageState>({
    locale: "ja",
    isHydrated: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Sync from localStorage on mount
    setState({
      locale: stored === "en" ? "en" : "ja",
      isHydrated: true,
    });
  }, []);

  const toggleLanguage = useCallback(() => {
    setState((prev) => {
      const nextLocale = prev.locale === "ja" ? "en" : "ja";
      localStorage.setItem(STORAGE_KEY, nextLocale);
      return { ...prev, locale: nextLocale };
    });
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        locale: state.locale,
        toggleLanguage,
        isHydrated: state.isHydrated,
      }}
    >
      <div style={{ opacity: state.isHydrated ? 1 : 0 }}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
