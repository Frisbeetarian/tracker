import { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { totals, meta } from "../lib/inventory";
import { SectionHeading } from "./ui";

const data = totals.map((t) => ({
  label: t.label,
  count: t.count,
  date: t.date,
}));

interface TooltipPayload {
  active?: boolean;
  payload?: { payload: (typeof data)[number] }[];
}

function RetroTooltip({ active, payload }: TooltipPayload) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="pixel-border bg-void px-3 py-2 font-[var(--font-term)] text-base">
      <div className="pixel-text text-[10px] text-cyan">{row.label}</div>
      <div className="mt-1 text-amber glow-amber">{row.count} airframes</div>
    </div>
  );
}

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
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 8, right: 16, left: -8, bottom: 8 }}>
            <CartesianGrid stroke="#1b2230" strokeDasharray="2 4" />
            <XAxis
              dataKey="label"
              stroke="#6b7689"
              tick={{ fill: "#6b7689", fontFamily: "VT323", fontSize: 16 }}
              tickLine={false}
            />
            <YAxis
              stroke="#6b7689"
              tick={{ fill: "#6b7689", fontFamily: "VT323", fontSize: 16 }}
              tickLine={false}
              domain={[0, "dataMax + 20"]}
            />
            <Tooltip content={<RetroTooltip />} cursor={{ stroke: "#00f0ff", strokeWidth: 1 }} />
            <ReferenceLine
              y={meta.fleetFloorRequirement}
              stroke="#ff2e88"
              strokeDasharray="4 4"
              label={{
                value: `FLOOR ${meta.fleetFloorRequirement}`,
                fill: "#ff2e88",
                fontFamily: "VT323",
                fontSize: 16,
                position: "insideTopRight",
              }}
            />
            <Line
              type="linear"
              dataKey="count"
              stroke="#ffb000"
              strokeWidth={3}
              dot={{ fill: "#ffb000", stroke: "#07070a", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: "#39ff14" }}
              style={{ filter: "drop-shadow(0 0 6px rgba(255,176,0,0.7))" }}
            />
          </LineChart>
        </ResponsiveContainer>
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
