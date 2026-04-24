import { describe, it, expect } from "bun:test";

import { getArgsFromStringWithSchema } from "#lib/get-args";
import { integer, tuple, union } from "#schemas";

describe("getArgsFromStringWithSchema", () => {
  describe("integer schema", () => {
    it("should parse single integer", () => {
      const result = getArgsFromStringWithSchema({
        schema: integer,
        input: "31",
      });
      expect(result.success).toBe(true);
      expect(result.data).toBe(31);
    });

    it("should parse negative integer", () => {
      const result = getArgsFromStringWithSchema({
        schema: integer,
        input: "-5",
      });
      expect(result.success).toBe(true);
      expect(result.data).toBe(-5);
    });

    it("should fail for non-integer string", () => {
      const result = getArgsFromStringWithSchema({
        schema: integer,
        input: "abc",
      });
      expect(result.success).toBe(false);
    });

    it("should fail for float", () => {
      const result = getArgsFromStringWithSchema({
        schema: integer,
        input: "3.14",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("tuple schema", () => {
    it("should parse tuple of two integers", () => {
      const result = getArgsFromStringWithSchema({
        schema: tuple([integer, integer]),
        input: "31 12",
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual([31, 12]);
    });

    it("should parse tuple of three integers", () => {
      const result = getArgsFromStringWithSchema({
        schema: tuple([integer, integer, integer]),
        input: "31 12 2026",
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual([31, 12, 2026]);
    });

    it("should fail for wrong number of elements", () => {
      const result = getArgsFromStringWithSchema({
        schema: tuple([integer, integer]),
        input: "31",
      });
      expect(result.success).toBe(false);
    });

    it("should handle empty input for required tuple", () => {
      const result = getArgsFromStringWithSchema({
        schema: tuple([integer, integer]),
        input: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("union schema", () => {
    it("should match first valid schema in union", () => {
      const result = getArgsFromStringWithSchema({
        schema: union([
          tuple([integer, integer]),
          tuple([integer, integer, integer]),
        ]),
        input: "31 12",
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual([31, 12]);
    });

    it("should match second valid schema in union", () => {
      const result = getArgsFromStringWithSchema({
        schema: union([
          tuple([integer, integer]),
          tuple([integer, integer, integer]),
        ]),
        input: "31 12 2026",
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual([31, 12, 2026]);
    });

    it("should fail when no schema matches", () => {
      const result = getArgsFromStringWithSchema({
        schema: union([
          tuple([integer, integer]),
          tuple([integer, integer, integer]),
        ]),
        input: "abc",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("whitespace handling", () => {
    it("should trim whitespace", () => {
      const result = getArgsFromStringWithSchema({
        schema: tuple([integer, integer]),
        input: "  31  12  ",
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual([31, 12]);
    });

    it("should handle multiple spaces", () => {
      const result = getArgsFromStringWithSchema({
        schema: tuple([integer, integer]),
        input: "31    12",
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual([31, 12]);
    });

    it("should replace underscores with spaces", () => {
      const result = getArgsFromStringWithSchema({
        schema: tuple([integer, integer]),
        input: "31_12",
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual([31, 12]);
    });
  });

  describe("empty input", () => {
    it("should return empty array for empty string", () => {
      const result = getArgsFromStringWithSchema({
        schema: union([tuple([]), tuple([integer, integer])]),
        input: "",
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });
  });
});
