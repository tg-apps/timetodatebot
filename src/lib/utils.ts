import { getTimeDifference } from "./time-difference";
import { getUnitName } from "./unit-name";
import type { Unit } from "./unit-name";

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
  date,
  duration,
  now,
  text,
}: {
  date: Temporal.PlainDate;
  duration: Temporal.Duration;
  now: Temporal.ZonedDateTime;
  text?: string;
}): string {
  const d = duration.abs();
  const seconds = Math.floor(d.total({ unit: "second" }));
  const precision = seconds.toString().length - 1;

  function format(num: number): string {
    if (precision < 0) return num.toString();
    return num.toPrecision(precision + 1).replace(/\.0+$/, "");
  }

  const line = (value: number, unit: Unit) =>
    `\`${format(value)}\` ${getUnitName(value, unit)}`;

  const units = [
    [Math.floor(d.days / 7), "week"],
    [d.days % 7, "day"],
    [d.hours, "hour"],
    [d.minutes, "minute"],
    [d.seconds, "second"],
  ] as const;

  const total = (unit: Unit) =>
    unit === "second" ? seconds : d.total({ unit, relativeTo: now });

  const lines = units.map(([value, unit]) => line(value, unit));
  const totals = units.map(([, unit]) => line(total(unit), unit));

  const dateStr = date.toLocaleString("ru-RU");
  text ??= `\`${dateStr}\``;
  const isPast = duration.sign < 0;
  const label = isPast ? `${text} наступило` : `До ${text} осталось`;
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
    const date = new Temporal.PlainDate(day, month, year);
    const duration = getTimeDifference(now, date);
    return formatOutput({ date, duration, now, text });
  } catch {
    return "Некорректная дата";
  }
}

export { getTimeUntilDate, getTargetYear };
