import { useEffect, useState } from "react";
import { currentTotal, netChangeSinceBaseline } from "../lib/inventory";

/**
 * Sticky tactical header that slides in once the hero scrolls out of view,
 * keeping the live count visible. Scroll listener is client-only; before it
 * runs the bar is parked off-screen, so it never obscures content.
 */
export default function HudBar() {
  const [show, setShow] = useState(false);
  const down = netChangeSinceBaseline < 0;

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 460);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-40 border-b-2 border-grid bg-void/90 backdrop-blur transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-5 sm:py-6">
        <span className="pixel-text flex items-center gap-2 text-xs text-cyan glow-cyan">
          <span className="blink">●</span> MQ-9 REAPER TRACKER
        </span>
        <span className="pixel-text flex items-baseline gap-2 text-xs">
          <span className="text-xl text-amber glow-amber sm:text-2xl">
            {currentTotal.count}
          </span>
          <span className="text-muted">REMAINING</span>
          <span className={down ? "text-magenta glow-magenta" : "text-green glow-green"}>
            {down ? "▼" : "▲"}
          </span>
        </span>
      </div>
    </div>
  );
}
