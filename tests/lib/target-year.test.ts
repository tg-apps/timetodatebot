import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  setSystemTime,
} from "bun:test";

import { getTargetYear } from "#lib/utils";

describe("getTargetYear", () => {
  beforeEach(() => {
    setSystemTime(new Date("2026-04-15T00:00:00"));
  });

  afterEach(() => {
    setSystemTime();
  });

  it("should return current year when date is in future", () => {
    const result = getTargetYear({ day: 20, month: 4 });
    expect(result).toBe(2026);
  });

  it("should return current year when date is same month and day", () => {
    const result = getTargetYear({ day: 15, month: 4 });
    expect(result).toBe(2026);
  });

  it("should return next year when date is in past", () => {
    const result = getTargetYear({ day: 10, month: 4 });
    expect(result).toBe(2027);
  });

  it("should return next year when date is earlier month", () => {
    const result = getTargetYear({ day: 1, month: 1 });
    expect(result).toBe(2027);
  });

  it("should return next year when date is same month, earlier day", () => {
    const result = getTargetYear({ day: 14, month: 4 });
    expect(result).toBe(2027);
  });

  describe("year boundary", () => {
    it("should return next year when date is December 31", () => {
      const result = getTargetYear({ day: 31, month: 12 });
      expect(result).toBe(2026);
    });

    it("should return next year when date is January 1", () => {
      const result = getTargetYear({ day: 1, month: 1 });
      expect(result).toBe(2027);
    });
  });

  describe("custom now", () => {
    it("should use provided now date", () => {
      const now = new Date("2026-12-15T00:00:00");
      const result = getTargetYear({ day: 1, month: 1, now });
      expect(result).toBe(2027);
    });

    it("should use provided now date for same month in future", () => {
      const now = new Date("2026-12-15T00:00:00");
      const result = getTargetYear({ day: 20, month: 12, now });
      expect(result).toBe(2026);
    });
  });
});
