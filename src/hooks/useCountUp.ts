import { useEffect, useRef, useState } from "react";

/**
 * Returns `target` for SSR and the first client render (so prerendered HTML and
 * hydration both show the real value), then — once `enabled` flips true —
 * animates from 0 up to `target`. Respects prefers-reduced-motion.
 */
export function useCountUp(target: number, enabled: boolean, durationMs = 1500) {
  const [value, setValue] = useState(target);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(target);
      return;
    }
    const t0 = performance.now();
    setValue(0);
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
