import { getTimeDifference } from "./time-difference";

const unitFormatters = new Map<string, Intl.NumberFormat>();

function getUnitName(value: number, unit: string): string {
  let formatter = unitFormatters.get(unit);
  if (!formatter) {
    formatter = new Intl.NumberFormat("ru-RU", {
      style: "unit",
      unit,
      unitDisplay: "long",
    });
    unitFormatters.set(unit, formatter);
  }
  return (
    formatter.formatToParts(value).find((part) => part.type === "unit")
      ?.value ?? ""
  );
}

function getTargetYear(
  now: Temporal.PlainDate,
  date: { day: number; month: number },
): number {
  const thisYear = new Temporal.PlainDate(now.year, date.month, date.day);
  return Temporal.PlainDate.compare(thisYear, now) < 0
    ? now.year + 1
    : now.year;
}

function formatOutput({
  day,
  month,
  year,
  duration,
  text,
}: {
  day: number;
  month: number;
  year: number;
  duration: Temporal.Duration;
  text?: string;
}): string {
  const dateStr = new Temporal.PlainDate(year, month, day).toLocaleString(
    "ru-RU",
  );

  text ??= `\`${dateStr}\``;
  const isPast = duration.sign < 0;
  const label = isPast ? `${text} наступило` : `До ${text} осталось`;

  const d = duration.abs();
  const totalSeconds = d.total({ unit: "second" });
  const intSeconds = Math.floor(totalSeconds);
  const precision = intSeconds.toString().length - 1;

  function format(num: number): string {
    if (precision < 0) return num.toString();
    return num.toPrecision(precision + 1).replace(/\.0+$/, "");
  }

  const line = (value: number, unit: string) =>
    `\`${format(value)}\` ${getUnitName(value, unit)}`;

  const units = [
    [Math.floor(d.days / 7), totalSeconds / (7 * 24 * 60 * 60), "week"],
    [d.days % 7, totalSeconds / (24 * 60 * 60), "day"],
    [d.hours, totalSeconds / (60 * 60), "hour"],
    [d.minutes, totalSeconds / 60, "minute"],
    [d.seconds, intSeconds, "second"],
  ] as const;

  const lines = units.map(([value, , unit]) => line(value, unit));
  const totals = units.map(([, total, unit]) => line(total, unit));

  const output = `${label}\n\n${lines.join("\n")}\n\n${totals.join("\n")}`;

  return isPast ? `${output}\n\nназад` : output;
}

function getTimeUntilDate(
  {
    day,
    month,
    year,
    text,
  }: {
    day: number;
    month: number;
    year?: number | null;
    text?: string;
  },
  now: Temporal.ZonedDateTime = Temporal.Now.zonedDateTimeISO(),
): string {
  try {
    year ??= getTargetYear(now.toPlainDate(), { day, month });
    const duration = getTimeDifference(now, { day, month, year });
    return formatOutput({ day, month, year, duration, text });
  } catch {
    return "Некорректная дата";
  }
}

export { getTimeUntilDate, getTargetYear };
