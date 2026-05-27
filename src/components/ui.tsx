import type { ReactNode } from "react";

export function SectionHeading({
  index,
  children,
}: {
  index: string;
  children: ReactNode;
}) {
  return (
    <h2 className="pixel-text mb-6 flex items-baseline gap-3 text-sm text-amber glow-amber sm:text-base">
      <span className="text-cyan glow-cyan">{index}</span>
      {children}
    </h2>
  );
}

type Tone = "green" | "amber" | "cyan" | "magenta" | "muted";

const toneClass: Record<Tone, string> = {
  green: "border-green text-green glow-green",
  amber: "border-amber text-amber glow-amber",
  cyan: "border-cyan text-cyan glow-cyan",
  magenta: "border-magenta text-magenta glow-magenta",
  muted: "border-grid text-muted",
};

export function Badge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={`pixel-text inline-block border px-2 py-1 text-[9px] uppercase ${toneClass[tone]}`}
    >
      {children}
    </span>
  );
}
