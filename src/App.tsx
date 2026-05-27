import { useEffect, useState } from "react";
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
  const [mounted, setMounted] = useState(false);
  const [bootDone, setBootDone] = useState(false);

  // Client-only: play the boot sequence on every page load. Skipped only for
  // reduced-motion visitors, in which case the count still resolves instantly.
  useEffect(() => {
    setMounted(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) setBootDone(true);
  }, []);

  return (
    <>
      <ExperimentBackground />
      <div className="crt-overlay" aria-hidden />
      {mounted && !bootDone && <BootSequence onDone={() => setBootDone(true)} />}
      <HudBar />

      <main className="relative z-10">
        <Hero animate={mounted && bootDone} />
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
