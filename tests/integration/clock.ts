import { mock } from "bun:test";

import { getTimeUntilDate } from "#utils";

const realGetTimeUntilDate = getTimeUntilDate;

export let now = Temporal.ZonedDateTime.from("2026-04-15T00:00:00[UTC]");

export function setNow(value: Temporal.ZonedDateTime): void {
  now = value;
}

await mock.module("#utils", () => ({
  getTimeUntilDate: (
    args: Parameters<typeof realGetTimeUntilDate>[0],
    nowArg?: Parameters<typeof realGetTimeUntilDate>[1],
  ) => realGetTimeUntilDate(args, nowArg ?? now),
}));
