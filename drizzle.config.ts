import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
  schema: "./server/db/schema.ts",
  out: "./server/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_URL || "data.db",
  },
} satisfies Config;
