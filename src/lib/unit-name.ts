const UNITS = ["week", "day", "hour", "minute", "second"] as const;

type Unit = (typeof UNITS)[number];

const unitFormatters = new Map(
  UNITS.map((unit) => [
    unit,
    new Intl.NumberFormat("ru-RU", {
      style: "unit",
      unit,
      unitDisplay: "long",
    }),
  ]),
);

function getUnitName(value: number, unit: Unit): string {
  return (
    unitFormatters
      .get(unit)
      ?.formatToParts(value)
      .find((part) => part.type === "unit")?.value ?? ""
  );
}

export { getUnitName };
export type { Unit };
