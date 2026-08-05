function getTargetYear(
  now: Temporal.PlainDate,
  date: { day: number; month: number },
): number {
  return now.with(date).until(now).sign > 0 ? now.year + 1 : now.year;
}

export { getTargetYear };
