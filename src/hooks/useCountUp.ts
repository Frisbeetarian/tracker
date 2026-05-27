import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Layout effect on the client so the reset-to-0 happens before the browser
// paints (no flash of the final value); plain effect during SSR to avoid a
// "useLayoutEffect does nothing on the server" warning at build time.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Returns `target` for SSR and the first client render (so prerendered HTML and
 * hydration both show the real value), then — once `enabled` flips true —
 * animates from 0 up to `target`. Respects prefers-reduced-motion.
 */
export function useCountUp(target: number, enabled: boolean, durationMs = 1500) {
  const [value, setValue] = useState(target);
  const rafRef = useRef<number | undefined>(undefined);

  useIsoLayoutEffect(() => {
    if (!enabled) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(target);
      return;
    }
    setValue(0);
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setValue(Math.round(target * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, target, durationMs]);

  return value;
}
