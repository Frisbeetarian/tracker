import {
  currentTotal,
  baselineTotal,
  netChangeSinceBaseline,
  documentedLosses,
  combatLossCostUsd,
  formatUsd,
  meta,
} from "../lib/inventory";
import { useLang } from "../i18n/LanguageContext";
import { totalLabel } from "../i18n/content.ar";

const toneText: Record<string, string> = {
  amber: "text-amber glow-amber",
  magenta: "text-magenta glow-magenta",
  green: "text-green glow-green",
  red: "text-red glow-red",
};

const VALUE = "text-2xl sm:text-3xl";

const stats = [
  { key: "statRemaining", value: currentTotal.count, tone: "amber", prefix: "", vcls: VALUE },
  {
    key: "statBelowFloor",
    value: meta.fleetFloorRequirement - currentTotal.count,
    tone: "magenta",
    prefix: "−",
    vcls: VALUE,
  },
  {
    key: "statNetChange",
    value: Math.abs(netChangeSinceBaseline),
    tone: "magenta",
    prefix: netChangeSinceBaseline < 0 ? "−" : "+",
    vcls: VALUE,
  },
  { key: "statDocumentedLosses", value: documentedLosses, tone: "green", prefix: "", vcls: VALUE },
  {
    key: "statCombatCost",
    value: formatUsd(combatLossCostUsd),
    tone: "red",
    prefix: "",
    vcls: "text-lg sm:text-xl",
  },
];

export default function StatGrid() {
  const { t, lang } = useLang();

  return (
    <section className="mx-auto max-w-4xl px-4 pb-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.key}
            className="pixel-border overflow-hidden bg-panel/60 px-2 py-4 text-center"
          >
            <div className={`pixel-text whitespace-nowrap ${s.vcls} ${toneText[s.tone]}`}>
              {s.prefix}
              {s.value}
            </div>
            <div className="mt-3 text-base leading-tight text-muted">{t(s.key)}</div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-center text-base leading-snug text-muted">
        {t("statFootnote", {
          label: totalLabel(baselineTotal.label, lang),
          count: baselineTotal.count,
        })}{" "}
        <a
          href="#methodology"
          className="text-cyan underline decoration-dotted underline-offset-4 hover:glow-cyan"
        >
          {t("why")}
        </a>
      </p>
    </section>
  );
}
