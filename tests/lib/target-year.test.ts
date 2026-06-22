import { describe, it, expect } from "bun:test";

import { getTargetYear } from "#lib/utils";

describe("getTargetYear", () => {
  const now = new Date("2026-04-15T00:00:00");

  it("should return current year when date is in future", () => {
    expect(getTargetYear(now, { day: 20, month: 4 })).toBe(2026);
  });

  it("should return current year when date is same month and day", () => {
    expect(getTargetYear(now, { day: 15, month: 4 })).toBe(2026);
  });

  it("should return next year when date is in past", () => {
    expect(getTargetYear(now, { day: 10, month: 4 })).toBe(2027);
  });

  it("should return next year when date is earlier month", () => {
    expect(getTargetYear(now, { day: 1, month: 1 })).toBe(2027);
  });

  it("should return next year when date is same month, earlier day", () => {
    expect(getTargetYear(now, { day: 14, month: 4 })).toBe(2027);
  });

  describe("year boundary", () => {
    it("should return next year when date is December 31", () => {
      expect(getTargetYear(now, { day: 31, month: 12 })).toBe(2026);
    });

    it("should return next year when date is January 1", () => {
      expect(getTargetYear(now, { day: 1, month: 1 })).toBe(2027);
    });
  });
});
