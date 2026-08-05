import { describe, it, expect } from "bun:test";

import { getTimeDifference } from "#lib/time-difference";

describe("getTimeDifference", () => {
  const now = Temporal.ZonedDateTime.from("2026-04-15T00:00:00[UTC]");

  it("should return positive duration for future date", () => {
    const result = getTimeDifference(now, { day: 16, month: 4, year: 2026 });
    expect(result.sign).toBe(1);
  });

  it("should return negative duration for past date", () => {
    const result = getTimeDifference(now, { day: 14, month: 4, year: 2026 });
    expect(result.sign).toBe(-1);
  });

  it("should return 1 day difference", () => {
    const result = getTimeDifference(now, { day: 16, month: 4, year: 2026 });
    expect(result.days).toBe(1);
  });

  it("should return 10 day difference", () => {
    const result = getTimeDifference(now, { day: 25, month: 4, year: 2026 });
    expect(result.days).toBe(10);
  });

  it("should return exact 1 week difference", () => {
    const result = getTimeDifference(now, { day: 22, month: 4, year: 2026 });
    expect(result.days).toBe(7);
  });

  it("should calculate hours, minutes, seconds correctly for non-zero values", () => {
    const now = Temporal.ZonedDateTime.from("2026-04-15T14:30:45[UTC]");
    const result = getTimeDifference(now, { day: 15, month: 4, year: 2026 });
    expect(result.abs().hours).toBe(14);
    expect(result.abs().minutes).toBe(30);
    expect(result.abs().seconds).toBe(45);
  });

  it("should handle 30-day future offset (Apr 15 → May 15)", () => {
    const result = getTimeDifference(now, { day: 15, month: 5, year: 2026 });
    expect(result.days).toBe(30);
  });

  it("should handle 365-day future offset (non-leap year)", () => {
    const result = getTimeDifference(now, { day: 15, month: 4, year: 2027 });
    expect(result.days).toBe(365);
  });

  it("should handle 366-day future offset across Feb 29 (leap year)", () => {
    const now = Temporal.ZonedDateTime.from("2027-04-15T00:00:00[UTC]");
    const result = getTimeDifference(now, { day: 15, month: 4, year: 2028 });
    expect(result.days).toBe(366);
  });

  it("should return zero for same date at midnight", () => {
    const result = getTimeDifference(now, { day: 15, month: 4, year: 2026 });
    expect(result.sign).toBe(0);
    expect(result.total({ unit: "second" })).toBe(0);
  });

  it("should handle past date 1 day ago", () => {
    const result = getTimeDifference(now, { day: 14, month: 4, year: 2026 });
    expect(result.days).toBe(-1);
  });

  it("should handle past date 1 week ago", () => {
    const result = getTimeDifference(now, { day: 8, month: 4, year: 2026 });
    expect(result.days).toBe(-7);
  });

  it("should resolve target to 01:00 when local midnight is skipped by DST", () => {
    const now = Temporal.ZonedDateTime.from(
      "2026-09-05T23:00:00[America/Santiago]",
    );
    const result = getTimeDifference(now, { day: 6, month: 9, year: 2026 });
    expect(result.sign).toBe(1);
    expect(result.abs().hours).toBe(2);
    expect(result.total({ unit: "second" })).toBe(7200);
  });

  it("should throw for an impossible date", () => {
    expect(() =>
      getTimeDifference(now, { day: 30, month: 2, year: 2026 }),
    ).toThrow(RangeError);
  });
});
