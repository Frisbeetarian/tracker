import { useLang } from "../i18n/LanguageContext";
import { SectionHeading } from "./ui";
import TrendChartCanvas from "./TrendChartCanvas";

export default function TrendChart() {
  const { t } = useLang();

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <SectionHeading index="01">{t("secTrend")}</SectionHeading>

      <div className="pixel-border bg-panel/60 p-4 pt-6">
        <TrendChartCanvas />
      </div>

      <p className="mt-4 text-lg text-muted">{t("trendCaption")}</p>
    </section>
  );
}
