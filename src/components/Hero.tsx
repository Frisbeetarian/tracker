import {
  currentTotal,
  baselineTotal,
  netChangeSinceBaseline,
  meta,
  formatDate,
} from "../lib/inventory";
import { useCountUp } from "../hooks/useCountUp";
import { useLang } from "../i18n/LanguageContext";
import { totalLabel } from "../i18n/content.ar";
import FloorBar from "./FloorBar";
import LanguageToggle from "./LanguageToggle";

export default function Hero({ animate = false }: { animate?: boolean }) {
  const { t, lang } = useLang();
  const down = netChangeSinceBaseline < 0;
  const delta = Math.abs(netChangeSinceBaseline);
  const count = useCountUp(currentTotal.count, animate);
  const baseLabel = totalLabel(baselineTotal.label, lang);

  return (
    <header id="hero" className="mx-auto max-w-4xl px-4 pt-8 pb-12">
      {/* Status strip */}
      <div className="pixel-border tactical-grid bg-panel/80 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pixel-text text-[10px] text-cyan">
          <span className="glow-cyan">{t("fleetStatus")}</span>
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-green glow-green">
              <span className="blink" aria-hidden>●</span> {t("tracking")}
            </span>
            <LanguageToggle />
          </span>
        </div>

        <hr className="my-4 border-grid" />

        <h1 className="pixel-text flex items-center justify-center gap-3 text-center text-xs text-cyan glow-cyan sm:text-sm">
          <span className="blink" aria-hidden>▮</span>
          {t("remainingTitle")}
          <span className="blink" aria-hidden>▮</span>
          <span className="sr-only">{t("heroH1Context")}</span>
        </h1>

        <div className="mt-4 flex flex-col items-center">
          <span className="pixel-text leading-none text-amber glow-amber-strong text-[clamp(5rem,19vw,12rem)]">
            {count}
          </span>
          <span
            className={`pixel-text mt-5 text-xs sm:text-sm ${
              down ? "text-magenta glow-magenta" : "text-green glow-green"
            }`}
          >
            <span aria-hidden>{down ? "▼" : "▲"}</span> {delta} {t("since")}{" "}
            {baseLabel.toUpperCase()}
          </span>
        </div>

        <p className="mt-6 text-center text-lg text-muted">
          {t("asOf")}{" "}
          <span className="text-ink">{formatDate(currentTotal.date, lang)}</span>{" "}
          · {t("source")}:{" "}
          <a
            href={currentTotal.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan underline decoration-dotted underline-offset-4 hover:glow-cyan"
          >
            {currentTotal.source.publisher}
          </a>
        </p>

        <div className="mt-6">
          <FloorBar
            current={currentTotal.count}
            floor={meta.fleetFloorRequirement}
            max={baselineTotal.count}
          />
        </div>
      </div>

      <p className="mt-6 text-xl leading-relaxed text-ink">{t("heroIntro")}</p>
    </header>
  );
}
