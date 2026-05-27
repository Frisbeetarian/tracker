import {
  currentTotal,
  baselineTotal,
  netChangeSinceBaseline,
  documentedLosses,
  combatLossCostUsd,
  formatUsd,
  meta,
} from "../lib/inventory";

const toneText: Record<string, string> = {
  amber: "text-amber glow-amber",
  magenta: "text-magenta glow-magenta",
  green: "text-green glow-green",
  red: "text-red glow-red",
};

const VALUE = "text-2xl sm:text-3xl";

const stats = [
  { label: "REMAINING", value: currentTotal.count, tone: "amber", prefix: "", vcls: VALUE },
  {
    label: "BELOW FLOOR",
    value: meta.fleetFloorRequirement - currentTotal.count,
    tone: "magenta",
    prefix: "−",
    vcls: VALUE,
  },
  {
    label: "NET CHANGE",
    value: Math.abs(netChangeSinceBaseline),
    tone: "magenta",
    prefix: netChangeSinceBaseline < 0 ? "−" : "+",
    vcls: VALUE,
  },
  { label: "DOCUMENTED LOSSES", value: documentedLosses, tone: "green", prefix: "", vcls: VALUE },
  {
    label: "COMBAT LOSS COST",
    value: formatUsd(combatLossCostUsd),
    tone: "red",
    prefix: "",
    vcls: "text-lg sm:text-xl",
  },
];

export default function StatGrid() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="pixel-border overflow-hidden bg-panel/60 px-2 py-4 text-center"
          >
            <div className={`pixel-text whitespace-nowrap ${s.vcls} ${toneText[s.tone]}`}>
              {s.prefix}
              {s.value}
            </div>
            <div className="mt-3 text-base leading-tight text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-center text-base leading-snug text-muted">
        Net change is the shift in the official total since {baselineTotal.label}{" "}
        ({baselineTotal.count}) — it includes planned retirements, not just
        losses, so it won't match documented losses. Combat-loss cost is an
        estimate.{" "}
        <a
          href="#methodology"
          className="text-cyan underline decoration-dotted underline-offset-4 hover:glow-cyan"
        >
          Why?
        </a>
      </p>
    </section>
  );
}
