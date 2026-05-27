import { useEffect, useRef, useState } from "react";

const LINES = [
  "> INITIALIZING REAPER TRACKER",
  "> ESTABLISHING UPLINK .......... OK",
  "> LOADING FLEET INVENTORY ...... OK",
  "> VERIFYING SOURCES ............ OK",
  "> RENDERING HUD ................ OK",
  "> SYSTEM ONLINE",
];

const STEP_MS = 280;
const FADE_MS = 700;

/**
 * Full-screen retro boot sequence shown on every page load (client-only;
 * never in prerendered HTML). Calls onReveal at the moment it starts fading
 * out — so the headline count begins ticking up while the overlay reveals it,
 * avoiding any flash of the final value. Removes itself once faded.
 */
export default function BootSequence({ onReveal }: { onReveal: () => void }) {
  const [shown, setShown] = useState(0);
  const [closing, setClosing] = useState(false);
  const [gone, setGone] = useState(false);
  const revealRef = useRef(onReveal);
  revealRef.current = onReveal;

  useEffect(() => {
    const timers: number[] = [];
    LINES.forEach((_, i) => {
      timers.push(window.setTimeout(() => setShown(i + 1), STEP_MS * (i + 1)));
    });
    const total = STEP_MS * LINES.length;
    // Hold ~1.2s on "SYSTEM ONLINE", then start fading AND start the count-up.
    timers.push(
      window.setTimeout(() => {
        setClosing(true);
        revealRef.current();
      }, total + 1200),
    );
    timers.push(window.setTimeout(() => setGone(true), total + 1200 + FADE_MS));
    return () => timers.forEach(clearTimeout);
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[70] flex items-center justify-center bg-void transition-opacity duration-700 ${
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
