import { useEffect, useState } from "react";
import { currentTotal, netChangeSinceBaseline } from "../lib/inventory";
import { useLang } from "../i18n/LanguageContext";
import LanguageToggle from "./LanguageToggle";

/**
 * Sticky tactical header that slides in once the hero scrolls out of view,
 * keeping the live count visible. Reveal logic is client-only; before it
 * runs the bar is parked off-screen, so it never obscures content.
 */
export default function HudBar() {
  const { t } = useLang();
  const [show, setShow] = useState(false);
  const down = netChangeSinceBaseline < 0;

  useEffect(() => {
    const el = document.getElementById("hero");
    if (el) {
      const io = new IntersectionObserver(
        ([entry]) => setShow(!entry.isIntersecting),
        { rootMargin: "-1px 0px 0px 0px" }
      );
      io.observe(el);
      return () => io.disconnect();
    }
    const onScroll = () => setShow(window.scrollY > 460);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-40 border-b-2 border-grid bg-void/90 backdrop-blur transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-5 sm:py-6">
        <span className="pixel-text flex items-center gap-2 text-xs text-cyan glow-cyan">
          <span className="blink" aria-hidden>●</span> {t("hudTitle")}
        </span>
        <span className="flex items-center gap-4">
          <span className="pixel-text flex items-baseline gap-2 text-xs">
            <span className="text-xl text-amber glow-amber sm:text-2xl">
              {currentTotal.count}
            </span>
            <span className="text-muted">{t("statRemaining")}</span>
            <span
              aria-hidden
              className={down ? "text-magenta glow-magenta" : "text-green glow-green"}
            >
              {down ? "▼" : "▲"}
            </span>
          </span>
          <LanguageToggle />
        </span>
      </div>
    </div>
  );
}
