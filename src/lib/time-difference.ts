function getTimeDifference({
  day,
  month,
  year,
  now,
}: {
  day: number;
  month: number;
  year: number;
  now?: Date;
}) {
  now ??= new Date();

  const targetDate = new Date(year, month - 1, day); // JS months are 0-indexed

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

export { getTimeDifference };
