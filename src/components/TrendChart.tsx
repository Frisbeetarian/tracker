import { Suspense, lazy, useEffect, useState } from "react";
import { useLang } from "../i18n/LanguageContext";
import { SectionHeading } from "./ui";

// Lazy so Recharts ships as a separate chunk, out of the critical path.
const TrendChartCanvas = lazy(() => import("./TrendChartCanvas"));

export default function TrendChart() {
  const { t } = useLang();
  // Recharts measures the DOM, so render it only on the client; the prerendered
  // HTML ships a same-size placeholder, avoiding SSR/hydration issues.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <SectionHeading index="01">{t("secTrend")}</SectionHeading>

      <div className="pixel-border bg-panel/60 p-4 pt-6">
        {mounted ? (
          <Suspense fallback={<div style={{ height: 320 }} aria-hidden />}>
            <TrendChartCanvas />
          </Suspense>
        ) : (
          <div style={{ height: 320 }} aria-hidden />
        )}
      </div>

      <p className="mt-4 text-lg text-muted">{t("trendCaption")}</p>
    </section>
  );
}
