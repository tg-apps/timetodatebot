import type { CommandContext, Context } from "grammy";
import type { User } from "grammy/types";

import { eq } from "drizzle-orm";

import { db } from "~/db";
import { users as usersTable } from "~/db/schema";
import { getArgsFromStringWithSchema } from "~/lib/getArgs";
import { getTargetYear, getTimeUntilDate } from "~/lib/utils";
import { integer, tuple, union } from "~/schemas";

async function getUserBirthday(userId: number) {
  const result = await db
    .select({ day: usersTable.day, month: usersTable.month })
    .from(usersTable)
    .where(eq(usersTable.userId, userId));

  return result[0] ?? null;
}

async function setUserBirthday(
  userId: number,
  date: { day: number; month: number },
) {
  await db
    .insert(usersTable)
    .values({ userId, ...date })
    .onConflictDoUpdate({
      target: usersTable.userId,
      set: date,
    });
}

function formatDate(date: { day: number; month: number }) {
  const formattedDay = date.day.toString().padStart(2, "0");
  const formattedMonth = date.month.toString().padStart(2, "0");
  return `${formattedDay}.${formattedMonth}`;
}

async function getBirthdayResponseFromInput(
  input: string,
  { userId }: { userId: number },
) {
  const args = getArgsFromStringWithSchema({
    schema: union([tuple([]), tuple([integer, integer])]),
    input,
  });

  if (!args.success) {
    console.error(args.error);
    return "Пример использования команды\n`/birthday 31 12`";
  }

  if (args.data.length == 2) {
    const [day, month] = args.data;
    const date = { day, month };
    await setUserBirthday(userId, date);
    const formattedDate = formatDate(date);
    return `День рождения установлен на \`${formattedDate}\``;
  }

  const birthday = await getUserBirthday(userId);
  if (!birthday)
    return "День рождения не установлен\nУстановите его командой `/birthday 31 12`";
  const year = getTargetYear(birthday);
  const { day, month } = birthday;
  return getTimeUntilDate({ day, month, year, text: "твоего дня рождения" });
}

export async function handle_birthday(
  context: CommandContext<Context> & { from: User },
) {
  const userId = context.from.id;
  const response = await getBirthdayResponseFromInput(context.match, {
    userId,
  });
  await context.reply(response, { parse_mode: "MarkdownV2" });
}
