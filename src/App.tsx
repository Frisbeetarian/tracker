import { useCallback, useEffect, useState } from "react";
import ExperimentBackground from "./components/ExperimentBackground";
import BootSequence from "./components/BootSequence";
import HudBar from "./components/HudBar";
import Hero from "./components/Hero";
import StatGrid from "./components/StatGrid";
import TrendChart from "./components/TrendChart";
import Timeline from "./components/Timeline";
import Methodology from "./components/Methodology";
import { meta, formatDate } from "./lib/inventory";
import { useLang } from "./i18n/LanguageContext";

export default function App() {
  const { t, lang } = useLang();
  const [showBoot, setShowBoot] = useState(false);
  const [countStarted, setCountStarted] = useState(false);
  const startCount = useCallback(() => setCountStarted(true), []);

  // Client-only: play the boot sequence once per browser session (skipped for
  // reduced motion). The count starts as the overlay begins fading, so the
  // number is already ticking when revealed — no flash of the final value.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setCountStarted(true);
      return;
    }
    try {
      if (sessionStorage.getItem("rt-booted")) setCountStarted(true);
      else {
        setShowBoot(true);
        sessionStorage.setItem("rt-booted", "1");
      }
    } catch {
      setShowBoot(true);
    }
  }, []);

  return (
    <>
      <ExperimentBackground />
      <div className="crt-overlay" aria-hidden />
      {showBoot && <BootSequence onReveal={startCount} />}
      <HudBar />

      <main className="relative z-10">
        <Hero animate={countStarted} />
        <StatGrid />
        <TrendChart />
        <Timeline />
        <Methodology />

        <footer className="mx-auto max-w-4xl px-4 py-12 text-center text-base text-muted">
          <p className="pixel-text text-[9px] leading-relaxed">
            {t("footerUpdated", {
              date: formatDate(meta.lastUpdated, lang),
            }).toUpperCase()}
          </p>
          <p className="mt-3">{t("footerDisclaimer")}</p>
        </footer>
      </main>
    </>
  );
}
