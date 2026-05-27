import { useLang } from "../i18n/LanguageContext";

/** Single button showing the *other* language; one click toggles. */
export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, toggle } = useLang();
  const code = lang === "en" ? "ع" : "EN";
  const label = lang === "en" ? "العربية" : "ENGLISH";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={lang === "en" ? "التبديل إلى العربية" : "Switch to English"}
      className={`pixel-border inline-flex items-center gap-2 bg-panel/60 px-2.5 py-1.5 pixel-text text-[10px] text-cyan transition-colors hover:text-amber ${className}`}
    >
      <span className="text-amber glow-amber">{code}</span>
      <span>{label}</span>
    </button>
  );
}
