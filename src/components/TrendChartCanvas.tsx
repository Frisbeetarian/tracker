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
import { useLang } from "../i18n/LanguageContext";
import { totalLabel } from "../i18n/content.ar";

interface Row {
  label: string;
  count: number;
  date: string;
}

/** Recharts chart, lazy-loaded so it stays out of the initial bundle. */
export default function TrendChartCanvas() {
  const { t, lang } = useLang();
  const data: Row[] = totals.map((tt) => ({
    label: totalLabel(tt.label, lang),
    count: tt.count,
    date: tt.date,
  }));
  const airframes = t("airframes");

  function RetroTooltip({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { payload: Row }[];
  }) {
    if (!active || !payload?.length) return null;
    const row = payload[0].payload;
    return (
      <div className="pixel-border bg-void px-3 py-2 font-[var(--font-term)] text-base">
        <div className="pixel-text text-[10px] text-cyan">{row.label}</div>
        <div className="mt-1 text-amber glow-amber">
          {row.count} {airframes}
        </div>
      </div>
    );
  }

  return (
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
            value: `${t("floor")} ${meta.fleetFloorRequirement}`,
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
  );
}
