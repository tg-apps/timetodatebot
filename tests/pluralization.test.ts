import { describe, it, expect } from "bun:test";

import { getPluralForm } from "~/lib/utils";

describe("getRussianPluralForm", () => {
  describe("hours forms", () => {
    const hourForms: [string, string, string] = ["час", "часа", "часов"];

    it("should use singular form for 1", () => {
      expect(getPluralForm(1, hourForms)).toBe("час");
    });

    it("should use genitive singular for 2-4", () => {
      expect(getPluralForm(2, hourForms)).toBe("часа");
      expect(getPluralForm(3, hourForms)).toBe("часа");
      expect(getPluralForm(4, hourForms)).toBe("часа");
    });

    it("should use genitive plural for 5-10", () => {
      expect(getPluralForm(5, hourForms)).toBe("часов");
      expect(getPluralForm(6, hourForms)).toBe("часов");
      expect(getPluralForm(10, hourForms)).toBe("часов");
    });

    it("should use genitive plural for 11-14 (special teen case)", () => {
      expect(getPluralForm(11, hourForms)).toBe("часов");
      expect(getPluralForm(12, hourForms)).toBe("часов");
      expect(getPluralForm(13, hourForms)).toBe("часов");
      expect(getPluralForm(14, hourForms)).toBe("часов");
    });

    it("should use singular form for 21, 31, 41", () => {
      expect(getPluralForm(21, hourForms)).toBe("час");
      expect(getPluralForm(31, hourForms)).toBe("час");
      expect(getPluralForm(41, hourForms)).toBe("час");
    });

    it("should use genitive singular for 22-24", () => {
      expect(getPluralForm(22, hourForms)).toBe("часа");
      expect(getPluralForm(23, hourForms)).toBe("часа");
      expect(getPluralForm(24, hourForms)).toBe("часа");
    });

    it("should use genitive plural for 25-30", () => {
      expect(getPluralForm(25, hourForms)).toBe("часов");
      expect(getPluralForm(29, hourForms)).toBe("часов");
      expect(getPluralForm(30, hourForms)).toBe("часов");
    });

    it("should handle zero correctly", () => {
      expect(getPluralForm(0, hourForms)).toBe("часов");
    });

    it("should handle negative numbers", () => {
      expect(getPluralForm(-1, hourForms)).toBe("час");
      expect(getPluralForm(-2, hourForms)).toBe("часа");
      expect(getPluralForm(-5, hourForms)).toBe("часов");
      expect(getPluralForm(-11, hourForms)).toBe("часов");
      expect(getPluralForm(-21, hourForms)).toBe("час");
    });
  });

  describe("different word forms", () => {
    it("should work with week forms", () => {
      const weekForms: [string, string, string] = [
        "неделя",
        "недели",
        "недель",
      ];

      expect(getPluralForm(1, weekForms)).toBe("неделя");
      expect(getPluralForm(2, weekForms)).toBe("недели");
      expect(getPluralForm(5, weekForms)).toBe("недель");
      expect(getPluralForm(11, weekForms)).toBe("недель");
      expect(getPluralForm(21, weekForms)).toBe("неделя");
    });

    it("should work with day forms", () => {
      const dayForms: [string, string, string] = ["день", "дня", "дней"];

      expect(getPluralForm(1, dayForms)).toBe("день");
      expect(getPluralForm(2, dayForms)).toBe("дня");
      expect(getPluralForm(5, dayForms)).toBe("дней");
      expect(getPluralForm(11, dayForms)).toBe("дней");
      expect(getPluralForm(21, dayForms)).toBe("день");
    });

    it("should work with minute forms", () => {
      const minuteForms: [string, string, string] = [
        "минута",
        "минуты",
        "минут",
      ];

      expect(getPluralForm(1, minuteForms)).toBe("минута");
      expect(getPluralForm(2, minuteForms)).toBe("минуты");
      expect(getPluralForm(5, minuteForms)).toBe("минут");
      expect(getPluralForm(11, minuteForms)).toBe("минут");
      expect(getPluralForm(21, minuteForms)).toBe("минута");
    });

    it("should work with second forms", () => {
      const secondForms: [string, string, string] = [
        "секунда",
        "секунды",
        "секунд",
      ];

      expect(getPluralForm(1, secondForms)).toBe("секунда");
      expect(getPluralForm(2, secondForms)).toBe("секунды");
      expect(getPluralForm(5, secondForms)).toBe("секунд");
      expect(getPluralForm(11, secondForms)).toBe("секунд");
      expect(getPluralForm(21, secondForms)).toBe("секунда");
    });
  });
});
