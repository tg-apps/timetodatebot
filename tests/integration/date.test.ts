import { describe, it, expect } from "bun:test";

import { getDateResponseFromContext } from "#handlers/date";

describe("handle_date integration", () => {
  describe("getDateResponseFromContext", () => {
    it("should return formatted response for valid date", () => {
      const result = getDateResponseFromContext("31 12");
      expect(result).toContain("31.12");
    });

    it("should return formatted response for date with year", () => {
      const result = getDateResponseFromContext("31 12 2025");
      expect(result).toContain("31.12.2025");
    });

    it("should return usage message for invalid input", () => {
      const result = getDateResponseFromContext("abc");
      expect(result).toContain("Пример использования");
    });

    it("should return usage message for empty input", () => {
      const result = getDateResponseFromContext("");
      expect(result).toContain("Пример использования");
    });

    it("should return usage message for single number", () => {
      const result = getDateResponseFromContext("31");
      expect(result).toContain("Пример использования");
    });

    it("should handle edge case day 1 month 1", () => {
      const result = getDateResponseFromContext("1 1");
      expect(result).toContain("01.01");
    });

    it("should handle single digit day and month with padding", () => {
      const result = getDateResponseFromContext("1 12");
      expect(result).toContain("01.12");
    });
  });
});
