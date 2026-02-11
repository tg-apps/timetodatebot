import { run } from "@grammyjs/runner";
import { Bot } from "grammy";

import * as handler from "./handlers";

const TOKEN = process.env["TOKEN"];

if (!TOKEN) {
  throw new Error("Missing TOKEN env variable");
}

const bot = new Bot(TOKEN);

const m = bot.on("message");

m.command("start", handler.handle_start);
m.command("help", handler.handle_help);
m.command(["newyear", "ny", "ng"], handler.handle_newyear);
m.command("christmas", handler.handle_christmas);
m.command(["summer", "leto"], handler.handle_summer);
m.command(["birthday", "dr"], handler.handle_birthday);
m.command("date", handler.handle_date);
m.command("customdate", handler.handle_customdate);

bot.on("::bot_command", async (context) => {
  if (context.chat.type !== "private") return;
  const response = "Команда не найдена! Список команд -> /help";
  await context.reply(response);
});

if (process.env.NODE_ENV === "production") {
  void bot.api.setMyCommands([
    { command: "help", description: "Помощь" },
    { command: "summer", description: "Лето" },
    { command: "christmas", description: "Рождество" },
    { command: "newyear", description: "Новый год" },
    { command: "birthday", description: "День рождения" },
    { command: "date", description: "Любая дата" },
    { command: "customdate", description: "Установить свою дату" },
  ]);
}

const runner = run(bot);

const stopRunner = () => runner.isRunning() && runner.stop();
process.once("SIGINT", stopRunner);
process.once("SIGTERM", stopRunner);
