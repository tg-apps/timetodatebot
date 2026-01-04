function getTargetYear({ day, month }: { day: number; month: number }): number {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // JS months are 0-indexed
  const currentDay = today.getDate();
  return currentMonth > month || (currentMonth === month && currentDay > day)
    ? currentYear + 1
    : currentYear;
}

function getPluralForm(
  number: number,
  forms: [string, string, string],
): string {
  const absNumber = Math.abs(number);
  const lastTwoDigits = absNumber % 100;
  const lastDigit = absNumber % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return forms[2]; // genitive plural
  }

  switch (lastDigit) {
    case 1:
      return forms[0]; // nominative singular
    case 2:
    case 3:
    case 4:
      return forms[1]; // genitive singular
    default:
      return forms[2]; // genitive plural
  }
}

function getTimeDifference({
  day,
  month,
  year,
}: {
  day: number;
  month: number;
  year: number;
}) {
  const targetDate = new Date(year, month - 1, day); // JS months are 0-indexed
  const now = new Date();

  const isPast = targetDate < now;
  const totalMs = Math.abs(now.getTime() - targetDate.getTime());
  const totalSeconds = totalMs / 1000;

  const totalDays = Math.floor(totalSeconds / 86400);
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;

  const secondsInDay = totalSeconds % 86400;
  const hours = Math.floor(secondsInDay / 3600);
  const minutes = Math.floor((secondsInDay % 3600) / 60);
  const seconds = Math.floor((secondsInDay % 3600) % 60);

  return {
    isPast,
    weeks,
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
  } as const;
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

  text = text || `\`${dateStr}\``;
  const label = isPast ? `${text} наступило` : `До ${text} осталось`;

  const intSeconds = Math.floor(totalSeconds);
  const digits = intSeconds.toString().length;
  const precision = digits - 1;

  function format(num: number): string {
    if (precision < 0) return num.toString();
    const str = num.toPrecision(precision + 1);
    return str.replace(/\.?0+$/, ""); // Remove trailing zeros and decimal if no fraction
  }

  const weeksTotal = format(totalSeconds / (7 * 24 * 60 * 60));
  const daysTotal = format(totalSeconds / (24 * 60 * 60));
  const hoursTotal = format(totalSeconds / (60 * 60));
  const minutesTotal = format(totalSeconds / 60);

  const output =
    `${label}\n\n` +
    `\`${weeks}\` ${getPluralForm(weeks, ["неделя", "недели", "недель"])}\n` +
    `\`${days}\` ${getPluralForm(days, ["день", "дня", "дней"])}\n` +
    `\`${hours}\` ${getPluralForm(hours, ["час", "часа", "часов"])}\n` +
    `\`${minutes}\` ${getPluralForm(minutes, ["минута", "минуты", "минут"])}\n` +
    `\`${seconds}\` ${getPluralForm(seconds, ["секунда", "секунды", "секунд"])}\n\n` +
    `\`${weeksTotal}\` ${getPluralForm(Math.floor(parseFloat(weeksTotal)), ["неделя", "недели", "недель"])}\n` +
    `\`${daysTotal}\` ${getPluralForm(Math.floor(parseFloat(daysTotal)), ["день", "дня", "дней"])}\n` +
    `\`${hoursTotal}\` ${getPluralForm(Math.floor(parseFloat(hoursTotal)), ["час", "часа", "часов"])}\n` +
    `\`${minutesTotal}\` ${getPluralForm(Math.floor(parseFloat(minutesTotal)), ["минута", "минуты", "минут"])}\n` +
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
  year?: number;
  text?: string;
}): string {
  year = year || getTargetYear({ day, month });
  const { isPast, weeks, days, hours, minutes, seconds, totalSeconds } =
    getTimeDifference({ day, month, year });
  return formatOutput({
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
  });
}

export { getTimeUntilDate, getTargetYear, getPluralForm };
