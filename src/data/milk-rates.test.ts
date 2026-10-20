import { describe, expect, test } from "bun:test";
import { latestEffectiveRate, rateInsertFromForm, type MilkRateRow } from "./milk-rates";

function row(id: string, date: string): MilkRateRow {
  return { id, effective_from: date, cow_rate_per_litre: 34.5, buffalo_rate_per_litre: 52, fat_bonus_per_percent: 1.8, snf_bonus_per_percent: 1.2, created_at: `${date}T00:00:00Z` };
}

describe("existing milk_rates rules", () => {
  test("latest date not later than today is selected regardless of row order", () => {
    expect(latestEffectiveRate([row("future", "2026-10-21"), row("old", "2026-10-01"), row("today", "2026-10-20")], "2026-10-20")?.id).toBe("today");
  });
  test("future-only or empty tables never fall back to demo rates", () => {
    expect(latestEffectiveRate([row("future", "2026-10-21")], "2026-10-20")).toBeUndefined();
    expect(latestEffectiveRate([], "2026-10-20")).toBeUndefined();
  });
  test("insert preserves base rates separately from shared bonuses and only actual columns", () => {
    expect(rateInsertFromForm({ effective_from: "2026-10-20", cow_rate_per_litre: "34.50", buffalo_rate_per_litre: "52", fat_bonus_per_percent: "1.8", snf_bonus_per_percent: "1.2", note: "not a column" })).toEqual({ effective_from: "2026-10-20", cow_rate_per_litre: 34.5, buffalo_rate_per_litre: 52, fat_bonus_per_percent: 1.8, snf_bonus_per_percent: 1.2 });
  });
  test("invalid revisions cannot become zero-value inserts", () => {
    expect(() => rateInsertFromForm({})).toThrow();
  });
});