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

export default function App() {
  const [showBoot, setShowBoot] = useState(false);
  const [countStarted, setCountStarted] = useState(false);
  const startCount = useCallback(() => setCountStarted(true), []);

  // Client-only: play the boot sequence on every load (skipped for reduced
  // motion). The count starts as the overlay begins fading, so the number is
  // already ticking when revealed — no flash of the final value.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) setCountStarted(true);
    else setShowBoot(true);
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
            DATA LAST UPDATED {formatDate(meta.lastUpdated).toUpperCase()}
          </p>
          <p className="mt-3">
            An independent, source-linked tracker. Not affiliated with the U.S.
            government. Figures reflect public reporting and official statements
            and may lag real events.
          </p>
        </footer>
      </main>
    </>
  );
}
