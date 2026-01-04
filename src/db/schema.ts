import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  userId: integer("user_id").notNull().unique(),
  day: integer("day").notNull(),
  month: integer("month").notNull(),
});

export const customDates = sqliteTable("custom_dates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.userId),
  name: text("name").notNull(),
  day: integer("day").notNull(),
  month: integer("month").notNull(),
  year: integer("year"),
});
