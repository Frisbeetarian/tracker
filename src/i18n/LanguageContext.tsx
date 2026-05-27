import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { STRINGS, fill, type Lang } from "./strings";

interface LangCtx {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const Ctx = createContext<LangCtx | null>(null);

/**
 * Defaults to English for SSR and the first client render (so the prerendered
 * HTML is English and hydration matches), then adopts the saved preference and
 * sets <html lang/dir> on the client.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("rt-lang");
    if (saved === "ar" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const persist = (l: Lang) => {
    try {
      localStorage.setItem("rt-lang", l);
    } catch {
      /* ignore */
    }
  };

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    persist(l);
  }, []);

  const toggle = useCallback(() => {
    setLangState((prev) => {
      const next: Lang = prev === "en" ? "ar" : "en";
      persist(next);
      return next;
    });
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const s = STRINGS[lang][key] ?? STRINGS.en[key] ?? key;
      return vars ? fill(s, vars) : s;
    },
    [lang],
  );

  return (
    <Ctx.Provider
      value={{ lang, dir: lang === "ar" ? "rtl" : "ltr", setLang, toggle, t }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useLang() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
