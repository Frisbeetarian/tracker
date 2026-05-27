import {
  currentTotal,
  baselineTotal,
  netChangeSinceBaseline,
  documentedLosses,
  meta,
} from "../lib/inventory";

const toneText: Record<string, string> = {
  amber: "text-amber glow-amber",
  magenta: "text-magenta glow-magenta",
  green: "text-green glow-green",
};

const stats = [
  { label: "REMAINING", value: currentTotal.count, tone: "amber", prefix: "" },
  {
    label: "BELOW FLOOR",
    value: meta.fleetFloorRequirement - currentTotal.count,
    tone: "magenta",
    prefix: "−",
  },
  {
    label: `SINCE ${baselineTotal.label.toUpperCase()}`,
    value: Math.abs(netChangeSinceBaseline),
    tone: "magenta",
    prefix: netChangeSinceBaseline < 0 ? "−" : "+",
  },
  { label: "DOCUMENTED LOSSES", value: documentedLosses, tone: "green", prefix: "" },
];

export default function StatGrid() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="pixel-border bg-panel/60 p-4 text-center">
            <div className={`pixel-text text-3xl sm:text-4xl ${toneText[s.tone]}`}>
              {s.prefix}
              {s.value}
            </div>
            <div className="mt-3 text-base leading-tight text-muted">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
