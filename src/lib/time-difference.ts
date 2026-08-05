function getTimeDifference(
  now: Temporal.ZonedDateTime,
  date: Temporal.PlainDate,
): Temporal.Duration {
  const target = date.toZonedDateTime({ timeZone: now.timeZoneId });
  return now.until(target, { largestUnit: "week" });
}

export { getTimeDifference };
