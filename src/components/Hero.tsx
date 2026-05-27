import {
  currentTotal,
  baselineTotal,
  netChangeSinceBaseline,
  meta,
  formatDate,
} from "../lib/inventory";
import FloorBar from "./FloorBar";

export default function Hero() {
  const down = netChangeSinceBaseline < 0;
  const delta = Math.abs(netChangeSinceBaseline);

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

        <p className="pixel-text text-[10px] text-muted">ACTIVE AIRFRAMES</p>

        <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-2">
          <span className="pixel-text text-6xl text-amber glow-amber sm:text-8xl">
            {currentTotal.count}
          </span>
          <span
            className={`pixel-text text-sm ${
              down ? "text-magenta glow-magenta" : "text-green glow-green"
            }`}
          >
            {down ? "▼" : "▲"} {delta} since {baselineTotal.label}
          </span>
        </div>

        <p className="mt-4 text-lg text-muted">
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
