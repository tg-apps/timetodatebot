import { describe, it, expect } from "bun:test";

import { getUnitName } from "#lib/unit-name";

describe("getUnitName", () => {
  it("should return singular form for 1", () => {
    expect(getUnitName(1, "week")).toBe("неделя");
    expect(getUnitName(1, "day")).toBe("день");
    expect(getUnitName(1, "hour")).toBe("час");
    expect(getUnitName(1, "minute")).toBe("минута");
    expect(getUnitName(1, "second")).toBe("секунда");
  });

  it("should return genitive form for 2", () => {
    expect(getUnitName(2, "week")).toBe("недели");
    expect(getUnitName(2, "day")).toBe("дня");
    expect(getUnitName(2, "hour")).toBe("часа");
    expect(getUnitName(2, "minute")).toBe("минуты");
    expect(getUnitName(2, "second")).toBe("секунды");
  });

  it("should return plural form for 5", () => {
    expect(getUnitName(5, "week")).toBe("недель");
    expect(getUnitName(5, "day")).toBe("дней");
    expect(getUnitName(5, "hour")).toBe("часов");
    expect(getUnitName(5, "minute")).toBe("минут");
    expect(getUnitName(5, "second")).toBe("секунд");
  });

  it("should return singular form for numbers ending in 1 except 11", () => {
    expect(getUnitName(21, "week")).toBe("неделя");
    expect(getUnitName(11, "week")).toBe("недель");
  });

  it("should return genitive singular form for fractional values", () => {
    expect(getUnitName(1.5, "hour")).toBe("часа");
    expect(getUnitName(1.5, "week")).toBe("недели");
    expect(getUnitName(0.02, "minute")).toBe("минуты");
  });
});
