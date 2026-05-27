import Hero from "./components/Hero";
import TrendChart from "./components/TrendChart";
import Timeline from "./components/Timeline";
import Methodology from "./components/Methodology";
import { meta, formatDate } from "./lib/inventory";

export default function App() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-center bg-no-repeat opacity-[0.07]"
        style={{
          backgroundImage: "url(/drone-bg.svg)",
          backgroundSize: "min(92vw, 880px)",
        }}
      />
      <div className="crt-overlay" aria-hidden />

      <main className="relative z-10">
        <Hero />
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
