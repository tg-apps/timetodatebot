import { Database } from "bun:sqlite";

import { drizzle } from "drizzle-orm/bun-sqlite";

import * as schema from "./schema";

const DB_FILE_NAME = process.env.DB_FILE_NAME ?? "database.db";

const sqlite = new Database(DB_FILE_NAME);

sqlite.run(`
PRAGMA foreign_keys = ON;

CREATE TABLE users (
  user_id integer NOT NULL,
  day integer NOT NULL,
  month integer NOT NULL,
  UNIQUE(user_id)
);

CREATE TABLE custom_dates (
  user_id integer PRIMARY KEY NOT NULL,
  day integer NOT NULL,
  month integer NOT NULL,
  year integer,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON UPDATE no action ON DELETE no action
);
`);

const db = drizzle(sqlite, { schema });

export { db };
