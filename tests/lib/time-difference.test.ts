import { describe, it, expect } from "bun:test";

import { getTimeDifference } from "#lib/time-difference";

describe("getTimeDifference", () => {
  const now = Temporal.ZonedDateTime.from("2026-04-15T00:00:00[UTC]");

  it("should return positive duration for future date", () => {
    const result = getTimeDifference(now, new Temporal.PlainDate(2026, 4, 16));
    expect(result.sign).toBe(1);
  });

  it("should return negative duration for past date", () => {
    const result = getTimeDifference(now, new Temporal.PlainDate(2026, 4, 14));
    expect(result.sign).toBe(-1);
  });

  it("should return 1 day difference", () => {
    const result = getTimeDifference(now, new Temporal.PlainDate(2026, 4, 16));
    expect(result.days).toBe(1);
  });

  it("should return 10 day difference", () => {
    const result = getTimeDifference(now, new Temporal.PlainDate(2026, 4, 25));
    expect(result.weeks).toBe(1);
    expect(result.days).toBe(3);
  });

  it("should return exact 1 week difference", () => {
    const result = getTimeDifference(now, new Temporal.PlainDate(2026, 4, 22));
    expect(result.weeks).toBe(1);
    expect(result.days).toBe(0);
  });

  it("should calculate hours, minutes, seconds correctly for non-zero values", () => {
    const now = Temporal.ZonedDateTime.from("2026-04-15T14:30:45[UTC]");
    const result = getTimeDifference(now, new Temporal.PlainDate(2026, 4, 15));
    expect(result.abs().hours).toBe(14);
    expect(result.abs().minutes).toBe(30);
    expect(result.abs().seconds).toBe(45);
  });

  it("should handle 30-day future offset (Apr 15 → May 15)", () => {
    const result = getTimeDifference(now, new Temporal.PlainDate(2026, 5, 15));
    expect(result.weeks * 7 + result.days).toBe(30);
  });

  it("should handle 365-day future offset (non-leap year)", () => {
    const result = getTimeDifference(now, new Temporal.PlainDate(2027, 4, 15));
    expect(result.weeks * 7 + result.days).toBe(365);
  });

  it("should handle 366-day future offset across Feb 29 (leap year)", () => {
    const now = Temporal.ZonedDateTime.from("2027-04-15T00:00:00[UTC]");
    const result = getTimeDifference(now, new Temporal.PlainDate(2028, 4, 15));
    expect(result.weeks * 7 + result.days).toBe(366);
  });

  it("should return zero for same date at midnight", () => {
    const result = getTimeDifference(now, new Temporal.PlainDate(2026, 4, 15));
    expect(result.sign).toBe(0);
    expect(result.total({ unit: "second" })).toBe(0);
  });

  it("should handle past date 1 day ago", () => {
    const result = getTimeDifference(now, new Temporal.PlainDate(2026, 4, 14));
    expect(result.days).toBe(-1);
  });

  it("should handle past date 1 week ago", () => {
    const result = getTimeDifference(now, new Temporal.PlainDate(2026, 4, 8));
    expect(result.weeks).toBe(-1);
    expect(result.days).toBe(0);
  });

  it("should account for DST skip when calculating actual elapsed time", () => {
    const now = Temporal.ZonedDateTime.from(
      "2026-09-05T23:00:00[America/Santiago]",
    );
    const result = getTimeDifference(now, new Temporal.PlainDate(2026, 9, 6));
    expect(result.sign).toBe(1);
    expect(result.abs().hours).toBe(1);
    expect(result.total({ unit: "second" })).toBe(3600);
  });

  it("should throw for an impossible date", () => {
    expect(() =>
      getTimeDifference(now, new Temporal.PlainDate(2026, 2, 30)),
    ).toThrow(RangeError);
  });
});
