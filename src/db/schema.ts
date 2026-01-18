import { sqliteTable, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  userId: integer("user_id").notNull().unique(),
  day: integer("day").notNull(),
  month: integer("month").notNull(),
});

export const customDates = sqliteTable("custom_dates", {
  userId: integer("user_id")
    .primaryKey()
    .references(() => users.userId),
  day: integer("day").notNull(),
  month: integer("month").notNull(),
  year: integer("year"),
});
