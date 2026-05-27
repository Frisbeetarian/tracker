import {
  currentTotal,
  baselineTotal,
  netChangeSinceBaseline,
  meta,
  formatDate,
} from "../lib/inventory";
import { useCountUp } from "../hooks/useCountUp";
import FloorBar from "./FloorBar";

export default function Hero({ animate = false }: { animate?: boolean }) {
  const down = netChangeSinceBaseline < 0;
  const delta = Math.abs(netChangeSinceBaseline);
  const count = useCountUp(currentTotal.count, animate);

  return (
    <header className="mx-auto max-w-4xl px-4 pt-8 pb-12">
      {/* Status strip */}
      <div className="pixel-border tactical-grid bg-panel/80 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pixel-text text-[10px] text-cyan">
          <span className="glow-cyan">MQ-9 REAPER // USAF FLEET</span>
          <span className="flex items-center gap-2 text-green glow-green">
            <span className="blink">●</span> TRACKING
          </span>
        </div>

        <hr className="my-4 border-grid" />

        <p className="pixel-text flex items-center justify-center gap-3 text-center text-xs text-cyan glow-cyan sm:text-sm">
          <span className="blink">▮</span>
          REMAINING MQ-9S
          <span className="blink">▮</span>
        </p>

        <div className="mt-4 flex flex-col items-center">
          <span className="pixel-text leading-none text-amber glow-amber-strong text-[clamp(5rem,19vw,12rem)]">
            {count}
          </span>
          <span
            className={`pixel-text mt-5 text-xs sm:text-sm ${
              down ? "text-magenta glow-magenta" : "text-green glow-green"
            }`}
          >
            {down ? "▼" : "▲"} {delta} SINCE {baselineTotal.label.toUpperCase()}
          </span>
        </div>

        <p className="mt-6 text-center text-lg text-muted">
          As of{" "}
          <span className="text-ink">{formatDate(currentTotal.date)}</span> ·
          source:{" "}
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

      <p className="mt-6 text-xl leading-relaxed text-ink">
        A sourced count of how many{" "}
        <span className="text-amber glow-amber">MQ-9 Reaper</span> drones remain
        in the U.S. Air Force fleet. The headline figure is the most recent total
        the Air Force has stated publicly — not a guess. Every number on this
        page links to its source.
      </p>
    </header>
  );
}
