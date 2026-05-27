import { Suspense, lazy, useEffect, useState } from "react";
import { SectionHeading } from "./ui";

// Lazy so Recharts ships as a separate chunk, out of the critical path.
const TrendChartCanvas = lazy(() => import("./TrendChartCanvas"));

export default function TrendChart() {
  // Recharts measures the DOM, so render it only on the client; the prerendered
  // HTML ships a same-size placeholder, avoiding SSR/hydration issues.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <SectionHeading index="01">FLEET TOTAL OVER TIME</SectionHeading>

      <div className="pixel-border bg-panel/60 p-4 pt-6">
        {mounted ? (
          <Suspense fallback={<div style={{ height: 320 }} aria-hidden />}>
            <TrendChartCanvas />
          </Suspense>
        ) : (
          <div style={{ height: 320 }} aria-hidden />
        )}
      </div>

      <p className="mt-4 text-lg text-muted">
        Each point is an officially-stated total, with its own source in the log
        below. The line is drawn between reported figures and does not imply the
        exact count on the days in between.
      </p>
    </section>
  );
}
