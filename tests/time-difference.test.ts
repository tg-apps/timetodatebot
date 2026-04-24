import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  setSystemTime,
} from "bun:test";

import { getTimeDifference } from "#utils";

describe("getTimeDifference", () => {
  beforeEach(() => {
    setSystemTime(new Date("2026-04-15T00:00:00"));
  });

  afterEach(() => {
    setSystemTime();
  });

  it("should return isPast false for future date", () => {
    const result = getTimeDifference({ day: 16, month: 4, year: 2026 });
    expect(result.isPast).toBe(false);
  });

  it("should return isPast true for past date", () => {
    const result = getTimeDifference({ day: 14, month: 4, year: 2026 });
    expect(result.isPast).toBe(true);
  });

  it("should return 1 day difference", () => {
    const result = getTimeDifference({ day: 16, month: 4, year: 2026 });
    expect(result.totalSeconds).toBe(86400);
  });

  it("should calculate weeks and days correctly for 10 days", () => {
    const result = getTimeDifference({ day: 25, month: 4, year: 2026 });
    expect(result.weeks).toBe(1);
    expect(result.days).toBe(3);
  });

  it("should calculate exact 1 week difference", () => {
    const result = getTimeDifference({ day: 22, month: 4, year: 2026 });
    expect(result.weeks).toBe(1);
    expect(result.days).toBe(0);
  });

  it("should calculate hours, minutes, seconds correctly for non-zero values", () => {
    setSystemTime(new Date("2026-04-15T14:30:45"));
    const result = getTimeDifference({ day: 15, month: 4, year: 2026 });
    expect(result.hours).toBe(14);
    expect(result.minutes).toBe(30);
    expect(result.seconds).toBe(45);
  });

  it("should handle 30-day future offset (Apr 15 → May 15)", () => {
    const result = getTimeDifference({ day: 15, month: 5, year: 2026 });
    expect(result.totalSeconds).toBe(86400 * 30);
  });

  it("should handle 365-day future offset (non-leap year)", () => {
    const result = getTimeDifference({ day: 15, month: 4, year: 2027 });
    expect(result.totalSeconds).toBe(86400 * 365);
  });

  it("should handle 366-day future offset across Feb 29 (leap year)", () => {
    setSystemTime(new Date("2027-04-15T00:00:00"));
    const result = getTimeDifference({ day: 15, month: 4, year: 2028 });
    expect(result.totalSeconds).toBe(86400 * 366);
  });

  it("should return zero for same date at midnight", () => {
    const result = getTimeDifference({ day: 15, month: 4, year: 2026 });
    expect(result.isPast).toBe(false);
    expect(result.totalSeconds).toBe(0);
  });

  it("should handle past date 1 day ago", () => {
    const result = getTimeDifference({ day: 14, month: 4, year: 2026 });
    expect(result.totalSeconds).toBe(86400);
  });

  it("should handle past date 1 week ago", () => {
    const result = getTimeDifference({ day: 8, month: 4, year: 2026 });
    expect(result.weeks).toBe(1);
    expect(result.days).toBe(0);
  });
});
