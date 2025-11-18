import type { Config } from "drizzle-kit";

/**
 * Drizzle Kit configuration for migrations
 * This configuration is used by drizzle-kit to generate and run migrations
 */
export default {
  schema: "./server/db/schema.ts",
  out: "./server/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "data.db",
  },
} satisfies Config;
