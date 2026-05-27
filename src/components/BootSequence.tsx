import { useEffect, useRef, useState } from "react";
import { useLang } from "../i18n/LanguageContext";

const LINES_EN = [
  "> INITIALIZING REAPER TRACKER",
  "> ESTABLISHING UPLINK .......... OK",
  "> LOADING FLEET INVENTORY ...... OK",
  "> VERIFYING SOURCES ............ OK",
  "> RENDERING HUD ................ OK",
  "> SYSTEM ONLINE",
];

const LINES_AR = [
  "> تشغيل متتبّع ريبر",
  "> تأسيس الاتصال .......... تم",
  "> تحميل بيانات الأسطول ...... تم",
  "> التحقق من المصادر ........... تم",
  "> عرض الواجهة ................ تم",
  "> النظام متّصل",
];

const LINE_COUNT = LINES_EN.length;
const STEP_MS = 280;
const FADE_MS = 700;

/**
 * Full-screen retro boot sequence shown on every page load (client-only;
 * never in prerendered HTML). Calls onReveal at the moment it starts fading
 * out — so the headline count begins ticking up while the overlay reveals it,
 * avoiding any flash of the final value. Removes itself once faded.
 */
export default function BootSequence({ onReveal }: { onReveal: () => void }) {
  const { lang } = useLang();
  const lines = lang === "ar" ? LINES_AR : LINES_EN;
  const [shown, setShown] = useState(0);
  const [closing, setClosing] = useState(false);
  const [gone, setGone] = useState(false);
  const revealRef = useRef(onReveal);
  revealRef.current = onReveal;

  useEffect(() => {
    const timers: number[] = [];
    for (let i = 0; i < LINE_COUNT; i++) {
      timers.push(window.setTimeout(() => setShown(i + 1), STEP_MS * (i + 1)));
    }
    const total = STEP_MS * LINE_COUNT;
    // Hold ~1.2s on the last line, then start fading AND start the count-up.
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
      <pre className="w-full max-w-lg px-6 text-start text-base leading-loose text-green glow-green sm:text-lg">
        {lines.slice(0, shown).map((line, i) => (
          <div key={i}>
            {line}
            {i === shown - 1 && <span className="blink"> █</span>}
          </div>
        ))}
      </pre>
    </div>
  );
}
