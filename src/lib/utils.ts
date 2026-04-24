import { getPluralForm } from "./get-plural-form";
import { getTimeDifference } from "./time-difference";

function getTargetYear({
  day,
  month,
  now,
}: {
  day: number;
  month: number;
  now?: Date;
}): number {
  now ??= new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // JS months are 0-indexed
  const currentDay = now.getDate();
  return currentMonth > month || (currentMonth === month && currentDay > day)
    ? currentYear + 1
    : currentYear;
}

function formatOutput({
  day,
  month,
  year,
  isPast,
  weeks,
  days,
  hours,
  minutes,
  seconds,
  totalSeconds,
  text,
}: {
  day: number;
  month: number;
  year: number;
  isPast: boolean;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  text?: string;
}): string {
  const dateStr = `${day.toString().padStart(2, "0")}.${month
    .toString()
    .padStart(2, "0")}.${year}`;

  text ??= `\`${dateStr}\``;
  const label = isPast ? `${text} наступило` : `До ${text} осталось`;

  const intSeconds = Math.floor(totalSeconds);
  const digits = intSeconds.toString().length;
  const precision = digits - 1;

  function format(num: number): string {
    if (precision < 0) return num.toString();
    const str = num.toPrecision(precision + 1);
    return str.replace(/\.0+$/, ""); // Remove trailing zeros and decimal if no fraction
  }

  const weeksTotal = totalSeconds / (7 * 24 * 60 * 60);
  const daysTotal = totalSeconds / (24 * 60 * 60);
  const hoursTotal = totalSeconds / (60 * 60);
  const minutesTotal = totalSeconds / 60;

  const output =
    `${label}\n\n` +
    `\`${weeks}\` ${getPluralForm(weeks, ["неделя", "недели", "недель"])}\n` +
    `\`${days}\` ${getPluralForm(days, ["день", "дня", "дней"])}\n` +
    `\`${hours}\` ${getPluralForm(hours, ["час", "часа", "часов"])}\n` +
    `\`${minutes}\` ${getPluralForm(minutes, ["минута", "минуты", "минут"])}\n` +
    `\`${seconds}\` ${getPluralForm(seconds, ["секунда", "секунды", "секунд"])}\n\n` +
    `\`${format(weeksTotal)}\` ${getPluralForm(weeksTotal, ["неделя", "недели", "недель"])}\n` +
    `\`${format(daysTotal)}\` ${getPluralForm(daysTotal, ["день", "дня", "дней"])}\n` +
    `\`${format(hoursTotal)}\` ${getPluralForm(hoursTotal, ["час", "часа", "часов"])}\n` +
    `\`${format(minutesTotal)}\` ${getPluralForm(minutesTotal, ["минута", "минуты", "минут"])}\n` +
    `\`${intSeconds}\` ${getPluralForm(intSeconds, ["секунда", "секунды", "секунд"])}`;

  if (isPast) {
    return output + "\n\nназад";
  }

  return output;
}

function getTimeUntilDate({
  day,
  month,
  year,
  text,
}: {
  day: number;
  month: number;
  year?: number | null;
  text?: string;
}): string {
  const now = new Date();
  year ??= getTargetYear({ day, month, now });
  const difference = getTimeDifference({ day, month, year });
  return formatOutput({ day, month, year, ...difference, text });
}

export { getTimeUntilDate, getTargetYear };
