import { describe, it, expect } from "bun:test";

import { getTimeUntilDate } from "#utils";

const now = (dateTime: string) =>
  Temporal.ZonedDateTime.from(`${dateTime}[UTC]`);

describe("getTimeUntilDate", () => {
  it("should return formatted output for future date", () => {
    const result = getTimeUntilDate(
      { day: 16, month: 4, year: 2026 },
      now("2026-04-15T00:00:00"),
    );
    expect(result).toMatchSnapshot();
  });

  it("should return formatted output for past date", () => {
    const result = getTimeUntilDate(
      { day: 14, month: 4, year: 2026 },
      now("2026-04-15T00:00:00"),
    );
    expect(result).toMatchSnapshot();
  });

  it("should return formatted output with custom text", () => {
    const result = getTimeUntilDate(
      {
        day: 16,
        month: 4,
        year: 2026,
        text: "твоего дня рождения",
      },
      now("2026-04-15T00:00:00"),
    );
    expect(result).toMatchSnapshot();
  });

  it("should auto-detect target year when not provided", () => {
    const result = getTimeUntilDate(
      { day: 16, month: 4 },
      now("2026-04-15T00:00:00"),
    );
    expect(result).toMatchSnapshot();
  });

  it("should use next year when date is in past (auto-detect)", () => {
    const result = getTimeUntilDate(
      { day: 1, month: 1 },
      now("2026-12-15T00:00:00"),
    );
    expect(result).toMatchSnapshot();
  });

  it("should return formatted output for far future date", () => {
    const result = getTimeUntilDate(
      { day: 1, month: 1, year: 2027 },
      now("2026-04-15T00:00:00"),
    );
    expect(result).toMatchSnapshot();
  });

  it("should handle same day at midnight", () => {
    const result = getTimeUntilDate(
      { day: 15, month: 4, year: 2026 },
      now("2026-04-15T00:00:00"),
    );
    expect(result).toMatchSnapshot();
  });

  it("should handle afternoon time 14:30:45", () => {
    const result = getTimeUntilDate(
      { day: 16, month: 4, year: 2026 },
      now("2026-04-15T14:30:45"),
    );
    expect(result).toMatchSnapshot();
  });

  it("should handle late evening time 23:59:59", () => {
    const result = getTimeUntilDate(
      { day: 16, month: 4, year: 2026 },
      now("2026-04-15T23:59:59"),
    );
    expect(result).toMatchSnapshot();
  });

  it("should handle early morning time 01:15:30", () => {
    const result = getTimeUntilDate(
      { day: 15, month: 4, year: 2026 },
      now("2026-04-15T01:15:30"),
    );
    expect(result).toMatchSnapshot();
  });

  it("should handle midday time for past date calculation", () => {
    const result = getTimeUntilDate(
      { day: 14, month: 4, year: 2026 },
      now("2026-04-15T12:00:00"),
    );
    expect(result).toMatchSnapshot();
  });

  describe("more than one week difference", () => {
    it("should handle 2 weeks ahead at midnight", () => {
      const result = getTimeUntilDate(
        { day: 29, month: 4, year: 2026 },
        now("2026-04-15T00:00:00"),
      );
      expect(result).toMatchSnapshot();
    });

    it("should handle 2 weeks ahead at noon", () => {
      const result = getTimeUntilDate(
        { day: 29, month: 4, year: 2026 },
        now("2026-04-15T12:00:00"),
      );
      expect(result).toMatchSnapshot();
    });

    it("should handle 1 month ahead at midnight", () => {
      const result = getTimeUntilDate(
        { day: 15, month: 5, year: 2026 },
        now("2026-04-15T00:00:00"),
      );
      expect(result).toMatchSnapshot();
    });

    it("should handle 1 month ahead at afternoon", () => {
      const result = getTimeUntilDate(
        { day: 15, month: 5, year: 2026 },
        now("2026-04-15T18:30:00"),
      );
      expect(result).toMatchSnapshot();
    });

    it("should handle 3 months ahead at midnight", () => {
      const result = getTimeUntilDate(
        { day: 15, month: 7, year: 2026 },
        now("2026-04-15T00:00:00"),
      );
      expect(result).toMatchSnapshot();
    });

    it("should handle 3 months ahead at evening", () => {
      const result = getTimeUntilDate(
        { day: 15, month: 7, year: 2026 },
        now("2026-04-15T21:45:30"),
      );
      expect(result).toMatchSnapshot();
    });

    it("should handle 1 year ahead at midnight", () => {
      const result = getTimeUntilDate(
        { day: 15, month: 4, year: 2027 },
        now("2026-04-15T00:00:00"),
      );
      expect(result).toMatchSnapshot();
    });

    it("should handle 1 year ahead at morning", () => {
      const result = getTimeUntilDate(
        { day: 15, month: 4, year: 2027 },
        now("2026-04-15T08:00:00"),
      );
      expect(result).toMatchSnapshot();
    });
  });

  it("should return error message for impossible date", () => {
    const result = getTimeUntilDate(
      { day: 30, month: 2 },
      now("2026-04-15T00:00:00"),
    );
    expect(result).toBe("Некорректная дата");
  });
});
