function getTimeDifference(
  now: Temporal.ZonedDateTime,
  date: Temporal.PlainDate,
): Temporal.Duration {
  return date
    .toZonedDateTime({ timeZone: now.timeZoneId })
    .toPlainDateTime()
    .since(now.toPlainDateTime());
}

export { getTimeDifference };
