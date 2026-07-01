import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString =
  process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/gazadon";

const sql = postgres(connectionString, {
  max: 10,
  prepare: false,
});

export const db = drizzle(sql);
