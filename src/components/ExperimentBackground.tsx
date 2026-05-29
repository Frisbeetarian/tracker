import { useState, type CSSProperties } from "react";

type Sprite = "top" | "side";
type Position = "center" | "center top" | "center bottom";

const COLORS = [
  { label: "AMBER", value: "#ffb000" },
  { label: "RED", value: "#ff2a2a" },
  { label: "CYAN", value: "#00f0ff" },
  { label: "GREEN", value: "#39ff14" },
  { label: "MAGENTA", value: "#ff2e88" },
  { label: "STEEL", value: "#2a3346" },
];

/**
 * Production background: the shipped pixel-art MQ-9 watermark, hardcoded to the
 * default look (red, 25%, 120px tiled top-view, bottom). No hooks, no config
 * string — so production does zero extra work.
 */
function StaticBackground() {
  const bgStyle: CSSProperties = {
    WebkitMaskImage: "url(/drone-bg.svg)",
    maskImage: "url(/drone-bg.svg)",
    WebkitMaskRepeat: "repeat",
    maskRepeat: "repeat",
    WebkitMaskPosition: "center bottom",
    maskPosition: "center bottom",
    WebkitMaskSize: "120px",
    maskSize: "120px",
    backgroundColor: "#ff2a2a",
    opacity: 0.25,
  };

  return <div aria-hidden className="pointer-events-none fixed inset-0 z-0" style={bgStyle} />;
}

/**
 * Dev-only watermark with a floating control panel to experiment with the look.
 * Defaults are the shipped look (red, 25%, 120px tiled top-view, bottom).
 */
function DevExperimentBackground() {
  const [opacity, setOpacity] = useState(0.25);
  const [sizePx, setSizePx] = useState(120);
  const [color, setColor] = useState("#ff2a2a");
  const [sprite, setSprite] = useState<Sprite>("top");
  const [tile, setTile] = useState(true);
  const [position, setPosition] = useState<Position>("center bottom");
  const [open, setOpen] = useState(true);

  const spriteUrl = sprite === "side" ? "/drone-bg-side.svg" : "/drone-bg.svg";

  const bgStyle: CSSProperties = {
    WebkitMaskImage: `url(${spriteUrl})`,
    maskImage: `url(${spriteUrl})`,
    WebkitMaskRepeat: tile ? "repeat" : "no-repeat",
    maskRepeat: tile ? "repeat" : "no-repeat",
    WebkitMaskPosition: position,
    maskPosition: position,
    WebkitMaskSize: `${sizePx}px`,
    maskSize: `${sizePx}px`,
    backgroundColor: color,
    opacity,
  };

  const config = `opacity ${opacity} · ${sizePx}px · ${color} · ${sprite}-view · ${
    tile ? "tiled" : "single"
  } · ${position}`;

  const btn = (active: boolean) =>
    `pixel-text border px-2 py-1 text-[8px] ${
      active
        ? "border-cyan text-cyan glow-cyan"
        : "border-grid text-muted hover:text-ink"
    }`;

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0" style={bgStyle} />

      <div className="pixel-border fixed bottom-3 right-3 z-[60] w-72 bg-void/95 p-3">
        <button
          onClick={() => setOpen((o) => !o)}
          className="pixel-text mb-2 flex w-full items-center justify-between text-[9px] text-cyan glow-cyan"
        >
          <span>▸ BG EXPERIMENT</span>
          <span>{open ? "[ − ]" : "[ + ]"}</span>
        </button>

        {open && (
          <div className="space-y-3 text-base">
            <label className="block">
              <span className="text-muted">Opacity · {opacity.toFixed(2)}</span>
              <input
                type="range"
                min={0}
                max={0.25}
                step={0.01}
                value={opacity}
                onChange={(e) => setOpacity(+e.target.value)}
                className="w-full accent-amber"
              />
            </label>

            <label className="block">
              <span className="text-muted">Size · {sizePx}px</span>
              <input
                type="range"
                min={120}
                max={1600}
                step={20}
                value={sizePx}
                onChange={(e) => setSizePx(+e.target.value)}
                className="w-full accent-amber"
              />
            </label>

            <div>
              <span className="text-muted">Color</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setColor(c.value)}
                    className={btn(color === c.value)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-muted">Sprite</span>
              <div className="mt-1 flex gap-1">
                <button onClick={() => setSprite("top")} className={btn(sprite === "top")}>
                  TOP
                </button>
                <button onClick={() => setSprite("side")} className={btn(sprite === "side")}>
                  SIDE
                </button>
                <button onClick={() => setTile((t) => !t)} className={btn(tile)}>
                  {tile ? "TILED" : "SINGLE"}
                </button>
              </div>
            </div>

            <div>
              <span className="text-muted">Position</span>
              <div className="mt-1 flex gap-1">
                {(["center top", "center", "center bottom"] as Position[]).map((p) => (
                  <button key={p} onClick={() => setPosition(p)} className={btn(position === p)}>
                    {p.replace("center", "").trim() || "MID"}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-grid pt-2">
              <p className="text-sm leading-snug text-muted">{config}</p>
              <button
                onClick={() => navigator.clipboard?.writeText(config)}
                className={`mt-1 ${btn(false)}`}
              >
                COPY CONFIG
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/**
 * Faint pixel-art MQ-9 watermark behind the page. In dev it renders the full
 * control panel; in production Vite replaces `import.meta.env.DEV` with `false`
 * and dead-code-eliminates the entire dev component (hooks + config string).
 */
export default function ExperimentBackground() {
  return import.meta.env.DEV ? <DevExperimentBackground /> : <StaticBackground />;
}
