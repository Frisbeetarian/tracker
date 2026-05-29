import { describe, it, expect } from "vitest";
import {
  totals,
  events,
  currentTotal,
  baselineTotal,
  netChangeSinceBaseline,
  documentedLosses,
  combatLosses,
  combatLossCostUsd,
  meta,
  formatUsd,
  formatDate,
  validateInventory,
} from "./inventory";

describe("core principle — headline is a stated total, never baseline-minus-losses", () => {
  it("currentTotal is the latest total (last element)", () => {
    expect(currentTotal).toBe(totals[totals.length - 1]);
  });

  it("baselineTotal is the earliest total (first element)", () => {
    expect(baselineTotal).toBe(totals[0]);
  });

  it("totals are sorted ascending by date", () => {
    for (let i = 1; i < totals.length; i++) {
      expect(totals[i - 1].date.localeCompare(totals[i].date)).toBeLessThanOrEqual(0);
    }
  });

  it("events are sorted descending by date", () => {
    for (let i = 1; i < events.length; i++) {
      expect(events[i - 1].date.localeCompare(events[i].date)).toBeGreaterThanOrEqual(0);
    }
  });

  it("netChangeSinceBaseline is the difference of stated totals, not a sum of losses", () => {
    expect(netChangeSinceBaseline).toBe(currentTotal.count - baselineTotal.count);
  });
});

describe("derived loss stats (context only — never summed into the headline)", () => {
  it("documentedLosses equals the sum of count over loss events", () => {
    const expected = events
      .filter((e) => e.type === "loss")
      .reduce((sum, e) => sum + e.count, 0);
    expect(documentedLosses).toBe(expected);
  });

  it("combatLosses equals the sum of count over shootdown/combat losses", () => {
    const expected = events
      .filter(
        (e) =>
          e.type === "loss" && (e.cause === "shootdown" || e.cause === "combat"),
      )
      .reduce((sum, e) => sum + e.count, 0);
    expect(combatLosses).toBe(expected);
  });

  it("combatLosses never exceeds documentedLosses (crashes excluded)", () => {
    expect(combatLosses).toBeLessThanOrEqual(documentedLosses);
  });

  it("combatLossCostUsd is combatLosses times the meta unit cost", () => {
    expect(combatLossCostUsd).toBe(combatLosses * meta.combatUnitCostUsd);
  });
});

describe("formatUsd", () => {
  it("renders billions to two decimals", () => {
    expect(formatUsd(1_080_000_000)).toBe("$1.08B");
  });

  it("renders millions as a rounded whole number", () => {
    expect(formatUsd(540_000_000)).toBe("$540M");
  });

  it("renders small amounts with thousands separators", () => {
    expect(formatUsd(1234)).toBe("$1,234");
  });
});

describe("formatDate", () => {
  it("formats an English date", () => {
    expect(formatDate("2026-05-20", "en")).toBe("May 20, 2026");
  });

  it("formats an Arabic date with Latin digits", () => {
    const out = formatDate("2026-05-20", "ar");
    expect(out).toContain("2026");
    expect(out).toContain("20");
  });
});

describe("validateInventory", () => {
  const source = {
    title: "T",
    publisher: "P",
    url: "https://example.com",
  };

  const validFixture = {
    meta: {
      lastUpdated: "2026-05-20",
      scope: "test scope",
      fleetFloorRequirement: 189,
      totalEverBuiltForUS: 575,
      combatUnitCostUsd: 30_000_000,
      combatUnitCostNote: "approx",
      notes: ["note"],
    },
    totals: [
      {
        date: "2026-05-20",
        label: "May 2026",
        count: 135,
        source,
      },
    ],
    events: [
      {
        id: "evt-1",
        date: "2026-04-07",
        type: "loss",
        count: 1,
        cause: "combat",
        title: "title",
        summary: "summary",
        confidence: "confirmed",
        sources: [source],
      },
    ],
  };

  it("accepts a minimal valid inventory", () => {
    expect(() => validateInventory(validFixture)).not.toThrow();
  });

  it("throws on an event with an invalid cause", () => {
    const bad = {
      ...validFixture,
      events: [{ ...validFixture.events[0], cause: "explosion" }],
    };
    expect(() => validateInventory(bad)).toThrow();
  });

  it("throws on a total missing count", () => {
    const { count: _count, ...totalWithoutCount } = validFixture.totals[0];
    const bad = { ...validFixture, totals: [totalWithoutCount] };
    expect(() => validateInventory(bad)).toThrow();
  });

  it.each([
    [
      "invalid confidence",
      { ...validFixture, events: [{ ...validFixture.events[0], confidence: "maybe" }] },
      /confidence/,
    ],
    [
      "invalid type",
      { ...validFixture, events: [{ ...validFixture.events[0], type: "removal" }] },
      /type/,
    ],
    ["empty totals", { ...validFixture, totals: [] }, /totals must be a non-empty array/],
    [
      "bad date format",
      { ...validFixture, totals: [{ ...validFixture.totals[0], date: "2026/05/20" }] },
      /YYYY-MM-DD/,
    ],
    [
      "calendar-invalid date",
      { ...validFixture, totals: [{ ...validFixture.totals[0], date: "2026-02-30" }] },
      /YYYY-MM-DD/,
    ],
    [
      "empty source url",
      {
        ...validFixture,
        totals: [{ ...validFixture.totals[0], source: { ...source, url: "" } }],
      },
      /url must be a non-empty string/,
    ],
    [
      "empty events sources",
      { ...validFixture, events: [{ ...validFixture.events[0], sources: [] }] },
      /sources must be a non-empty array/,
    ],
  ])("throws on %s", (_label, bad, re) => {
    expect(() => validateInventory(bad)).toThrow(re);
  });
});
