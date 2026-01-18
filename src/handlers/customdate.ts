import type { CommandContext, Context } from "grammy";

import { eq } from "drizzle-orm";

import { db } from "~/db";
import { customDates } from "~/db/schema";
import { getArgsFromStringWithSchema } from "~/lib/getArgs";
import { getTimeUntilDate } from "~/lib/utils";
import { integer, tuple, union } from "~/schemas";

async function handleCustomDateCommand(userId: number) {
  const date = await db
    .select()
    .from(customDates)
    .where(eq(customDates.userId, userId))
    .then((events) => events[0]);

  if (!date) {
    return "Дата не установлена\nУстанови её командой `/customdate 31 12` или `/customdate 31 12 2030`";
  }

  const response = getTimeUntilDate({
    day: date.day,
    month: date.month,
    year: date.year,
    text: "твоей даты",
  });

  return response;
}

async function upsertCustomDate(
  userId: number,
  date: { day: number; month: number; year?: number },
) {
  await db
    .insert(customDates)
    .values({ userId, ...date })
    .onConflictDoUpdate({
      target: customDates.userId,
      set: date,
    });
}

async function getCustomDateResponseFromContext(userId: number, input: string) {
  const args = getArgsFromStringWithSchema({
    schema: union([
      tuple([]),
      tuple([integer, integer]),
      tuple([integer, integer, integer]),
    ]),
    input,
  });

  if (!args.success) {
    console.error(args.error);
    return "Пример использования команды\n`/customdate 31 12` или `/customdate 31 12 2030`";
  }

  if (args.data.length === 0) {
    return await handleCustomDateCommand(userId);
  }

  const [day, month, year] = args.data;
  const date = { day, month, year };

  await upsertCustomDate(userId, date);

  const formattedDate = `${day.toString().padStart(2, "0")}.${month.toString().padStart(2, "0")}${year ? `.${year}` : ""}`;
  return `Дата установлена на \`${formattedDate}\``;
}

export async function handle_customdate(context: CommandContext<Context>) {
  const userId = context.from!.id;

  const response = await getCustomDateResponseFromContext(
    userId,
    context.match,
  );

  await context.reply(response, { parse_mode: "MarkdownV2" });
}
