interface FloorBarProps {
  current: number;
  floor: number;
  /** Upper bound of the bar; defaults to the floor. */
  max?: number;
}

const SEGMENTS = 24;

/**
 * Chunky pixel-segment gauge showing the current fleet against the
 * required floor. Segments below the floor glow amber/green; the
 * shortfall reads as dark, dead cells.
 */
export default function FloorBar({ current, floor, max }: FloorBarProps) {
  const ceiling = max ?? floor;
  const filled = Math.round((Math.min(current, ceiling) / ceiling) * SEGMENTS);
  const floorMark = Math.round((floor / ceiling) * SEGMENTS);
  const belowFloor = current < floor;

  return (
    <div className="w-full">
      <div className="flex gap-[3px]" aria-hidden>
        {Array.from({ length: SEGMENTS }).map((_, i) => {
          const isFilled = i < filled;
          const atFloorMark = i === floorMark - 1;
          return (
            <div
              key={i}
              className={[
                "h-5 flex-1",
                isFilled
                  ? belowFloor
                    ? "bg-amber shadow-[0_0_8px_var(--color-amber)]"
                    : "bg-green shadow-[0_0_8px_var(--color-green)]"
                  : "bg-grid",
                atFloorMark ? "outline outline-2 outline-magenta" : "",
              ].join(" ")}
            />
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-muted">
        <span>
          <span className={belowFloor ? "text-amber glow-amber" : "text-green glow-green"}>
            {current}
          </span>{" "}
          IN SERVICE
        </span>
        <span className="text-magenta glow-magenta">
          REQ. FLOOR {floor}
        </span>
      </div>
    </div>
  );
}
