function getTimeDifference(
  now: Temporal.ZonedDateTime,
  { day, month, year }: { day: number; month: number; year: number },
): Temporal.Duration {
  const target = new Temporal.PlainDate(year, month, day).toZonedDateTime({
    timeZone: now.timeZoneId,
  });

  return target.toPlainDateTime().since(now.toPlainDateTime());
}

export { getTimeDifference };
