import { useState } from "react";
import { totals, meta } from "../lib/inventory";
import { useLang } from "../i18n/LanguageContext";
import { totalLabel } from "../i18n/content.ar";

const VB_W = 640;
const VB_H = 320;
const M = { left: 40, right: 18, top: 16, bottom: 30 };
const PLOT_L = M.left;
const PLOT_R = VB_W - M.right;
const PLOT_T = M.top;
const PLOT_B = VB_H - M.bottom;

/** Hand-rolled inline SVG line chart — lightweight, server-rendered. */
export default function TrendChartCanvas() {
  const { t, lang } = useLang();
  const [hover, setHover] = useState<number | null>(null);

  const floor = meta.fleetFloorRequirement;
  const counts = totals.map((tt) => tt.count);
  const yMax = Math.ceil((Math.max(...counts, floor) + 20) / 50) * 50;
  const n = totals.length;

  const yTicks: number[] = [];
  for (let v = 0; v <= yMax; v += 50) yTicks.push(v);

  const xFor = (i: number) =>
    n === 1 ? (PLOT_L + PLOT_R) / 2 : PLOT_L + (i * (PLOT_R - PLOT_L)) / (n - 1);
  const yFor = (count: number) =>
    PLOT_B - (count / yMax) * (PLOT_B - PLOT_T);

  const colW = n > 1 ? (PLOT_R - PLOT_L) / (n - 1) : PLOT_R - PLOT_L;

  const polyline = totals.map((tt, i) => `${xFor(i)},${yFor(tt.count)}`).join(" ");

  const first = totals[0];
  const last = totals[n - 1];
  const ariaLabel = `${t("secTrend")}: ${first.count} (${totalLabel(
    first.label,
    lang,
  )}) → ${last.count} (${totalLabel(last.label, lang)}). ${t(
    "floor",
  )} ${floor}.`;

  // Tooltip geometry (client-only, never affects SSR/first render).
  const tip = (() => {
    if (hover == null) return null;
    const tt = totals[hover];
    const label = totalLabel(tt.label, lang);
    const valueText = `${tt.count} ${t("airframes")}`;
    const w = Math.max(label.length * 6 + 16, valueText.length * 9 + 16, 80);
    const h = 38;
    const cx = xFor(hover);
    const py = yFor(tt.count);
    let x = cx - w / 2;
    if (x < 2) x = 2;
    if (x + w > VB_W - 2) x = VB_W - 2 - w;
    let y = py - h - 12;
    if (y < 2) y = py + 12;
    return { x, y, w, h, label, valueText, cx, py };
  })();

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="block w-full h-auto"
      role="img"
      aria-label={ariaLabel}
    >
      {/* grid lines */}
      {yTicks.map((v) => (
        <line
          key={`g${v}`}
          x1={PLOT_L}
          x2={PLOT_R}
          y1={yFor(v)}
          y2={yFor(v)}
          stroke="#1b2230"
          strokeDasharray="2 4"
        />
      ))}

      {/* y-axis tick labels */}
      {yTicks.map((v) => (
        <text
          key={`yl${v}`}
          x={PLOT_L - 6}
          y={yFor(v) + 5}
          fontFamily="VT323"
          fontSize={14}
          fill="#757f93"
          textAnchor="end"
        >
          {v}
        </text>
      ))}

      {/* x-axis labels — endpoints anchored inward so they don't clip */}
      {totals.map((tt, i) => (
        <text
          key={`xl${tt.date}`}
          x={xFor(i)}
          y={PLOT_B + 20}
          fontFamily="VT323"
          fontSize={14}
          fill="#757f93"
          textAnchor={
            n === 1 ? "middle" : i === 0 ? "start" : i === n - 1 ? "end" : "middle"
          }
        >
          {totalLabel(tt.label, lang)}
        </text>
      ))}

      {/* floor reference line */}
      <line
        x1={PLOT_L}
        x2={PLOT_R}
        y1={yFor(floor)}
        y2={yFor(floor)}
        stroke="#ff2e88"
        strokeDasharray="4 4"
      />
      <text
        x={PLOT_R}
        y={yFor(floor) - 5}
        fontFamily="VT323"
        fontSize={14}
        fill="#ff2e88"
        textAnchor="end"
      >
        {`${t("floor")} ${floor}`}
      </text>

      {/* data polyline */}
      <polyline
        points={polyline}
        fill="none"
        stroke="#ffb000"
        strokeWidth={3}
        style={{ filter: "drop-shadow(0 0 6px rgba(255,176,0,0.7))" }}
      />

      {/* data dots */}
      {totals.map((tt, i) => (
        <circle
          key={`d${tt.date}`}
          cx={xFor(i)}
          cy={yFor(tt.count)}
          r={5}
          fill="#ffb000"
          stroke="#07070a"
          strokeWidth={2}
        />
      ))}

      {/* hover cursor + active dot */}
      {hover != null && (
        <>
          <line
            x1={xFor(hover)}
            x2={xFor(hover)}
            y1={PLOT_T}
            y2={PLOT_B}
            stroke="#00f0ff"
            strokeWidth={1}
          />
          <circle cx={xFor(hover)} cy={yFor(totals[hover].count)} r={7} fill="#39ff14" />
        </>
      )}

      {/* tooltip */}
      {tip && (
        <g>
          <rect
            x={tip.x}
            y={tip.y}
            width={tip.w}
            height={tip.h}
            fill="#07070a"
            stroke="#1b2230"
            strokeWidth={1}
          />
          <text
            x={tip.x + 8}
            y={tip.y + 14}
            fontFamily='"Press Start 2P"'
            fontSize={9}
            fill="#00f0ff"
          >
            {tip.label}
          </text>
          <text
            x={tip.x + 8}
            y={tip.y + 31}
            fontFamily="VT323"
            fontSize={16}
            fill="#ffb000"
          >
            {tip.valueText}
          </text>
        </g>
      )}

      {/* hover hit-targets (one per point) */}
      {totals.map((tt, i) => (
        <rect
          key={`h${tt.date}`}
          x={xFor(i) - colW / 2}
          y={PLOT_T}
          width={colW}
          height={PLOT_B - PLOT_T}
          fill="transparent"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          onTouchStart={() => setHover(i)}
        />
      ))}
    </svg>
  );
}
