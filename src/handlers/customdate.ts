import type { CommandContext, Context } from "grammy";

import { eq } from "drizzle-orm";

import { db } from "~/db";
import { customDates } from "~/db/schema";
import { getArgsFromStringWithSchema } from "~/lib/getArgs";
import { getTimeUntilDate } from "~/lib/utils";
import { integer, string, tuple, union } from "~/schemas";

async function handleCustomDateCommand(
  eventName: string,
  context: Context,
) {
  const userId = context.from!.id;

  const date = await db
    .select()
    .from(customDates)
    .where(eq(customDates.userId, userId))
    .then((events) => events.find((e) => e.name === eventName));

  if (!date) {
    return `Событие \`${eventName}\` не найдено\nСоздай его командой \`/customdate ${eventName} 31 12\``;
  }

  const response = getTimeUntilDate({
    day: date.day,
    month: date.month,
    year: date.year,
    text: `\`${date.name}\``,
  });

  return response;
}

async function getUserCustomDates(userId: number) {
  return await db
    .select()
    .from(customDates)
    .where(eq(customDates.userId, userId));
}

async function upsertCustomDate(
  userId: number,
  name: string,
  date: { day: number; month: number; year?: number },
) {
  await db
    .insert(customDates)
    .values({ userId, name, ...date })
    .onConflictDoUpdate({
      target: [customDates.userId, customDates.name],
      set: date,
    });
}

async function getCustomDateResponseFromContext(
  context: CommandContext<Context>,
  { userId }: { userId: number },
) {
  const args = getArgsFromStringWithSchema({
    schema: union([
      tuple([]),
      tuple([string]),
      tuple([string, integer, integer]),
      tuple([string, integer, integer, integer]),
    ]),
    input: context.match,
  });

  if (!args.success) {
    console.error(args.error);
    return "Пример использования команды\n`/customdate holidays 14 06` или `/customdate event 17 05 2030`";
  }

  if (args.data.length === 0) {
    return await getCustomDateList(userId);
  }

  if (args.data.length === 1) {
    const [eventName] = args.data;
    return handleCustomDateCommand(eventName, context);
  }

  const [name, day, month, year] = args.data;
  const date = { day, month, year };

  await upsertCustomDate(userId, name, date);

  return getTimeUntilDate({ ...date, text: `\`${name}\`` });
}

async function getCustomDateList(userId: number) {
  const events = await getUserCustomDates(userId);

  if (events.length === 0) {
    return "У тебя нет сохранённых дат\nСоздай их командой `/customdate name 31 12`";
  }

  const eventNames = events.map((event) => event.name).join("\n");

  return `*Твои даты:*\n\n${eventNames}`;
}

export async function handle_customdate(context: CommandContext<Context>) {
  const userId = context.from!.id;

  const response = await getCustomDateResponseFromContext(context, {
    userId,
  });

  await context.reply(response, { parse_mode: "MarkdownV2" });
}
