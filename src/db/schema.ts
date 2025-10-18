import { sqliteTable, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  user_id: integer("user_id").notNull().unique(),
  day: integer("day").notNull(),
  month: integer("month").notNull(),
});
