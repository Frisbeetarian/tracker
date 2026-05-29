import rawData from "../data/inventory.json";
import type { Lang } from "../i18n/strings";

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

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const CAUSES: EventCause[] = ["shootdown", "crash", "combat", "retired", "other"];
const CONFIDENCES: Confidence[] = ["confirmed", "reported", "estimated"];
const EVENT_TYPES: ReaperEvent["type"][] = ["loss", "addition"];

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === "string";
const isNum = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);
/** A real calendar date in YYYY-MM-DD form (rejects 2026-13-40, 2026-02-30, …). */
const isIsoDate = (s: string): boolean => {
  if (!DATE_RE.test(s)) return false;
  const d = new Date(s + "T00:00:00Z");
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(s);
};

function isSource(v: unknown, where: string): Source {
  if (!isObj(v)) throw new Error(`Invalid ${where}: must be an object`);
  for (const key of ["title", "publisher", "url"] as const) {
    if (!isStr(v[key]) || v[key].length === 0)
      throw new Error(`Invalid ${where}: ${key} must be a non-empty string`);
  }
  return v as unknown as Source;
}

/** Validate raw JSON against the Inventory shape, throwing a descriptive Error. */
export function validateInventory(raw: unknown): Inventory {
  if (!isObj(raw)) throw new Error("Invalid inventory: root must be an object");

  // meta
  const meta = raw.meta;
  if (!isObj(meta)) throw new Error("Invalid inventory: meta must be an object");
  for (const key of ["lastUpdated", "scope", "combatUnitCostNote"] as const) {
    if (!isStr(meta[key]))
      throw new Error(`Invalid meta.${key}: must be a string`);
  }
  for (const key of [
    "fleetFloorRequirement",
    "totalEverBuiltForUS",
    "combatUnitCostUsd",
  ] as const) {
    if (!isNum(meta[key]))
      throw new Error(`Invalid meta.${key}: must be a finite number`);
  }
  if (!Array.isArray(meta.notes) || !meta.notes.every(isStr))
    throw new Error("Invalid meta.notes: must be an array of strings");

  // totals
  if (!Array.isArray(raw.totals) || raw.totals.length === 0)
    throw new Error("Invalid inventory: totals must be a non-empty array");
  raw.totals.forEach((t, i) => {
    const at = `totals[${i}]`;
    if (!isObj(t)) throw new Error(`Invalid ${at}: must be an object`);
    if (!isStr(t.date) || !isIsoDate(t.date))
      throw new Error(`Invalid ${at}: date must be a real YYYY-MM-DD date`);
    if (!isStr(t.label))
      throw new Error(`Invalid ${at}: label must be a string`);
    if (!isNum(t.count))
      throw new Error(`Invalid ${at}: count must be a finite number`);
    if (t.note !== undefined && !isStr(t.note))
      throw new Error(`Invalid ${at}: note must be a string when present`);
    isSource(t.source, `${at}.source`);
  });

  // events
  if (!Array.isArray(raw.events))
    throw new Error("Invalid inventory: events must be an array");
  raw.events.forEach((e, i) => {
    if (!isObj(e)) throw new Error(`Invalid events[${i}]: must be an object`);
    const id = isStr(e.id) ? e.id : "";
    const at = `events[${i}] (id "${id}")`;
    if (!isStr(e.id)) throw new Error(`Invalid events[${i}]: id must be a string`);
    if (!isStr(e.date) || !isIsoDate(e.date))
      throw new Error(`Invalid ${at}: date must be a real YYYY-MM-DD date`);
    if (!isStr(e.type) || !EVENT_TYPES.includes(e.type as ReaperEvent["type"]))
      throw new Error(
        `Invalid ${at}: type "${String(e.type)}" is not one of ${EVENT_TYPES.join(", ")}`,
      );
    if (!isNum(e.count))
      throw new Error(`Invalid ${at}: count must be a finite number`);
    if (!isStr(e.cause) || !CAUSES.includes(e.cause as EventCause))
      throw new Error(
        `Invalid ${at}: cause "${String(e.cause)}" is not one of ${CAUSES.join(", ")}`,
      );
    if (!isStr(e.title))
      throw new Error(`Invalid ${at}: title must be a string`);
    if (!isStr(e.summary))
      throw new Error(`Invalid ${at}: summary must be a string`);
    if (
      !isStr(e.confidence) ||
      !CONFIDENCES.includes(e.confidence as Confidence)
    )
      throw new Error(
        `Invalid ${at}: confidence "${String(e.confidence)}" is not one of ${CONFIDENCES.join(", ")}`,
      );
    if (!Array.isArray(e.sources) || e.sources.length === 0)
      throw new Error(`Invalid ${at}: sources must be a non-empty array`);
    e.sources.forEach((s, j) => isSource(s, `${at}.sources[${j}]`));
  });

  return raw as unknown as Inventory;
}

const inventory = validateInventory(rawData);

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

/** Format an ISO date, e.g. "May 20, 2026" / "20 مايو 2026" (Latin digits). */
export function formatDate(iso: string, lang: Lang = "en"): string {
  const locale = lang === "ar" ? "ar-u-nu-latn" : "en-US";
  return new Date(iso + "T00:00:00Z").toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
