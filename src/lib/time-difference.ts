function getTimeDifference(
  now: Temporal.ZonedDateTime,
  { day, month, year }: { day: number; month: number; year: number },
) {
  const target = new Temporal.PlainDate(year, month, day)
    .toZonedDateTime({ timeZone: now.timeZoneId })
    .toPlainDateTime();

  const duration = target.since(now.toPlainDateTime());
  const abs = duration.abs();

  return {
    isPast: duration.sign < 0,
    weeks: Math.floor(abs.days / 7),
    days: abs.days % 7,
    hours: abs.hours,
    minutes: abs.minutes,
    seconds: abs.seconds,
    totalSeconds: Math.abs(duration.total({ unit: "second" })),
  } as const;
}

export { getTimeDifference };
