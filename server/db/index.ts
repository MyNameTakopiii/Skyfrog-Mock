import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import * as schema from "./schema";

/**
 * Get the correct database path based on environment
 * In production (built), the database is in the same directory as the server
 * In development, it's in the project root
 */
function getDatabasePath(): string {
  // Check if we're in production build (.output/server)
  const currentDir = dirname(fileURLToPath(import.meta.url));

  // In production, database is copied to .output/server/data.db
  if (currentDir.includes(".output")) {
    return join(currentDir, "..", "data.db");
  }

  // In development, database is in project root
  return "data.db";
}

const dbPath = getDatabasePath();
console.log("📊 Database path:", dbPath);

/**
 * SQLite database connection
 * Uses better-sqlite3 for synchronous database operations
 */
const sqlite = new Database(dbPath);

/**
 * Drizzle ORM instance
 * Provides type-safe database operations with the defined schema
 */
export const db = drizzle(sqlite, { schema });
