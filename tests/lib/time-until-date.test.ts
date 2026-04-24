import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  setSystemTime,
} from "bun:test";

import { getTimeUntilDate } from "#utils";

describe("getTimeUntilDate", () => {
  beforeEach(() => {
    setSystemTime(new Date("2026-04-15T00:00:00"));
  });

  afterEach(() => {
    setSystemTime();
  });

  it("should return formatted output for future date", () => {
    const result = getTimeUntilDate({ day: 16, month: 4, year: 2026 });
    expect(result).toMatchSnapshot();
  });

  it("should return formatted output for past date", () => {
    const result = getTimeUntilDate({ day: 14, month: 4, year: 2026 });
    expect(result).toMatchSnapshot();
  });

  it("should return formatted output with custom text", () => {
    const result = getTimeUntilDate({
      day: 16,
      month: 4,
      year: 2026,
      text: "твоего дня рождения",
    });
    expect(result).toMatchSnapshot();
  });

  it("should auto-detect target year when not provided", () => {
    const result = getTimeUntilDate({ day: 16, month: 4 });
    expect(result).toMatchSnapshot();
  });

  it("should use next year when date is in past (auto-detect)", () => {
    setSystemTime(new Date("2026-12-15T00:00:00"));
    const result = getTimeUntilDate({ day: 1, month: 1 });
    expect(result).toMatchSnapshot();
  });

  it("should return formatted output for far future date", () => {
    const result = getTimeUntilDate({ day: 1, month: 1, year: 2027 });
    expect(result).toMatchSnapshot();
  });

  it("should handle same day at midnight", () => {
    const result = getTimeUntilDate({ day: 15, month: 4, year: 2026 });
    expect(result).toMatchSnapshot();
  });

  it("should handle afternoon time 14:30:45", () => {
    setSystemTime(new Date("2026-04-15T14:30:45"));
    const result = getTimeUntilDate({ day: 16, month: 4, year: 2026 });
    expect(result).toMatchSnapshot();
  });

  it("should handle late evening time 23:59:59", () => {
    setSystemTime(new Date("2026-04-15T23:59:59"));
    const result = getTimeUntilDate({ day: 16, month: 4, year: 2026 });
    expect(result).toMatchSnapshot();
  });

  it("should handle early morning time 01:15:30", () => {
    setSystemTime(new Date("2026-04-15T01:15:30"));
    const result = getTimeUntilDate({ day: 15, month: 4, year: 2026 });
    expect(result).toMatchSnapshot();
  });

  it("should handle midday time for past date calculation", () => {
    setSystemTime(new Date("2026-04-15T12:00:00"));
    const result = getTimeUntilDate({ day: 14, month: 4, year: 2026 });
    expect(result).toMatchSnapshot();
  });

  describe("more than one week difference", () => {
    it("should handle 2 weeks ahead at midnight", () => {
      const result = getTimeUntilDate({ day: 29, month: 4, year: 2026 });
      expect(result).toMatchSnapshot();
    });

    it("should handle 2 weeks ahead at noon", () => {
      setSystemTime(new Date("2026-04-15T12:00:00"));
      const result = getTimeUntilDate({ day: 29, month: 4, year: 2026 });
      expect(result).toMatchSnapshot();
    });

    it("should handle 1 month ahead at midnight", () => {
      const result = getTimeUntilDate({ day: 15, month: 5, year: 2026 });
      expect(result).toMatchSnapshot();
    });

    it("should handle 1 month ahead at afternoon", () => {
      setSystemTime(new Date("2026-04-15T18:30:00"));
      const result = getTimeUntilDate({ day: 15, month: 5, year: 2026 });
      expect(result).toMatchSnapshot();
    });

    it("should handle 3 months ahead at midnight", () => {
      const result = getTimeUntilDate({ day: 15, month: 7, year: 2026 });
      expect(result).toMatchSnapshot();
    });

    it("should handle 3 months ahead at evening", () => {
      setSystemTime(new Date("2026-04-15T21:45:30"));
      const result = getTimeUntilDate({ day: 15, month: 7, year: 2026 });
      expect(result).toMatchSnapshot();
    });

    it("should handle 1 year ahead at midnight", () => {
      const result = getTimeUntilDate({ day: 15, month: 4, year: 2027 });
      expect(result).toMatchSnapshot();
    });

    it("should handle 1 year ahead at morning", () => {
      setSystemTime(new Date("2026-04-15T08:00:00"));
      const result = getTimeUntilDate({ day: 15, month: 4, year: 2027 });
      expect(result).toMatchSnapshot();
    });
  });
});
