import { getTargetYear } from "./target-year";
import { getTimeDifference } from "./time-difference";
import { getUnitName } from "./unit-name";
import type { Unit } from "./unit-name";

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
  const seconds = Math.floor(d.total({ unit: "second", relativeTo: now }));
  const precision = seconds.toString().length;

  function format(num: number): string {
    return num.toPrecision(precision).replace(/\.0+$/, "");
  }

  const line = (value: number, unit: Unit) =>
    `\`${format(value)}\` ${getUnitName(value, unit)}`;

  const units = [
    [d.weeks, "week"],
    [d.days, "day"],
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
  opts: { day: number; month: number; year?: number | null; text?: string },
  now: Temporal.ZonedDateTime = Temporal.Now.zonedDateTimeISO(),
): string {
  try {
    const { day, month, text } = opts;
    const year = opts.year ?? getTargetYear(now.toPlainDate(), { day, month });
    const date = Temporal.PlainDate.from({ day, month, year });
    const duration = getTimeDifference(now, date);
    return formatOutput({ date, duration, now, text });
  } catch {
    return "Некорректная дата";
  }
}

export { getTimeUntilDate };
