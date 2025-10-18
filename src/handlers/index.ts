import type { CommandContext, Context } from "grammy";

import { HELP_MESSAGE } from "~/constants";

import { getTimeUntilDate } from "~/lib/utils";

async function handle_start(context: CommandContext<Context>) {
  await context.reply(HELP_MESSAGE, { parse_mode: "MarkdownV2" });
}

async function handle_help(context: CommandContext<Context>) {
  await context.reply(HELP_MESSAGE, { parse_mode: "MarkdownV2" });
}

async function handle_newyear(context: CommandContext<Context>) {
  const response = getTimeUntilDate({ day: 1, month: 1, text: "Нового года" });
  await context.reply(response, { parse_mode: "MarkdownV2" });
}

async function handle_christmas(context: CommandContext<Context>) {
  const response = getTimeUntilDate({ day: 7, month: 1, text: "Рождества" });
  await context.reply(response, { parse_mode: "MarkdownV2" });
}

async function handle_summer(context: CommandContext<Context>) {
  const response = getTimeUntilDate({ day: 1, month: 6, text: "лета" });
  await context.reply(response, { parse_mode: "MarkdownV2" });
}

export {
  handle_start,
  handle_help,
  handle_newyear,
  handle_christmas,
  handle_summer,
};

export { handle_birthday } from "./birthday";
export { handle_date } from "./date";
