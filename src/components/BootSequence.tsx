import { useEffect, useState } from "react";

const LINES = [
  "> INITIALIZING REAPER TRACKER",
  "> ESTABLISHING UPLINK .......... OK",
  "> LOADING FLEET INVENTORY ...... OK",
  "> VERIFYING SOURCES ............ OK",
  "> RENDERING HUD ................ OK",
  "> SYSTEM ONLINE",
];

const STEP_MS = 280;

/**
 * Full-screen retro boot sequence shown on every page load.
 * Rendered client-only by App (never in the prerendered HTML). Calls onDone
 * when finished so the headline count can start ticking up.
 */
export default function BootSequence({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timers: number[] = [];
    LINES.forEach((_, i) => {
      timers.push(window.setTimeout(() => setShown(i + 1), STEP_MS * (i + 1)));
    });
    const total = STEP_MS * LINES.length;
    // Hold on "SYSTEM ONLINE" for ~1.45s, then fade out over 0.5s.
    timers.push(window.setTimeout(() => setClosing(true), total + 1450));
    timers.push(window.setTimeout(() => onDone(), total + 2000));
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[70] flex items-center justify-center bg-void transition-opacity duration-500 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
    >
      <pre className="w-full max-w-lg px-6 text-left text-base leading-loose text-green glow-green sm:text-lg">
        {LINES.slice(0, shown).map((line, i) => (
          <div key={i}>
            {line}
            {i === shown - 1 && <span className="blink"> █</span>}
          </div>
        ))}
      </pre>
    </div>
  );
}
