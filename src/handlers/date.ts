import type { CommandContext, Context } from "grammy";

import { getArgsFromStringWithSchema } from "#lib/get-args";
import { integer, tuple, union } from "#schemas";
import { getTimeUntilDate } from "#utils";

function getDateResponseFromContext(input: string) {
  const args = getArgsFromStringWithSchema({
    schema: union([
      tuple([integer, integer]),
      tuple([integer, integer, integer]),
    ]),
    input,
  });
  if (!args.success) {
    return "Пример использования команды\n`/date 31 12`";
  }
  const [day, month, year] = args.data;
  const response = getTimeUntilDate({ day, month, year });
  return response;
}

export async function handle_date(context: CommandContext<Context>) {
  const response = getDateResponseFromContext(context.match);
  await context.reply(response, { parse_mode: "MarkdownV2" });
}
