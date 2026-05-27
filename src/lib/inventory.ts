import rawData from "../data/inventory.json";

/** A citation backing a total or an event. */
export interface Source {
  title: string;
  publisher: string;
  url: string;
}

/** An officially-stated fleet total at a point in time. */
export interface Total {
  /** ISO date (YYYY-MM-DD) the figure applies to. */
  date: string;
  /** Short label for charts, e.g. "May 2026". */
  label: string;
  count: number;
  note?: string;
  source: Source;
}

export type EventCause =
  | "shootdown"
  | "crash"
  | "combat"
  | "retired"
  | "other";

export type Confidence = "confirmed" | "reported" | "estimated";

/** A documented loss or addition. Illustrative — NOT summed into the headline. */
export interface ReaperEvent {
  id: string;
  /** ISO date (YYYY-MM-DD); best estimate when the exact day is unknown. */
  date: string;
  type: "loss" | "addition";
  /** Number of airframes involved in this event. */
  count: number;
  cause: EventCause;
  title: string;
  summary: string;
  confidence: Confidence;
  sources: Source[];
}

export interface InventoryMeta {
  lastUpdated: string;
  scope: string;
  fleetFloorRequirement: number;
  totalEverBuiltForUS: number;
  combatUnitCostUsd: number;
  combatUnitCostNote: string;
  notes: string[];
}

export interface Inventory {
  meta: InventoryMeta;
  totals: Total[];
  events: ReaperEvent[];
}

const inventory = rawData as unknown as Inventory;

export const meta = inventory.meta;

/** Official fleet totals, sorted oldest → newest. */
export const totals: Total[] = [...inventory.totals].sort((a, b) =>
  a.date.localeCompare(b.date),
);

/** Documented events, sorted newest → oldest (for the timeline). */
export const events: ReaperEvent[] = [...inventory.events].sort((a, b) =>
  b.date.localeCompare(a.date),
);

/** The most recent officially-stated fleet total — the headline figure. */
export const currentTotal: Total = totals[totals.length - 1];

/** The earliest tracked total, used to frame the decline. */
export const baselineTotal: Total = totals[0];

/** Net change from the earliest to the most recent official total. */
export const netChangeSinceBaseline: number =
  currentTotal.count - baselineTotal.count;

/** Total airframes across all documented loss events (context stat, not fleet math). */
export const documentedLosses: number = events
  .filter((e) => e.type === "loss")
  .reduce((sum, e) => sum + e.count, 0);

/** Airframes lost specifically to enemy action (shootdowns + combat), not crashes. */
export const combatLosses: number = events
  .filter(
    (e) =>
      e.type === "loss" && (e.cause === "shootdown" || e.cause === "combat"),
  )
  .reduce((sum, e) => sum + e.count, 0);

/** Estimated dollar cost of the combat-downed airframes. */
export const combatLossCostUsd: number = combatLosses * meta.combatUnitCostUsd;

/** Compact USD: $1.08B, $540M, etc. */
export function formatUsd(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${Math.round(n / 1e6)}M`;
  return `$${n.toLocaleString("en-US")}`;
}

/** Format an ISO date as e.g. "May 20, 2026". */
export function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
