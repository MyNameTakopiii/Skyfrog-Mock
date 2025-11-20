import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

/**
 * Get database URL from environment
 */
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

console.log("📊 Connecting to NeonDB PostgreSQL...");

/**
 * Neon serverless PostgreSQL connection
 * Uses HTTP for serverless environments
 */
const sql = neon(databaseUrl);

/**
 * Drizzle ORM instance
 * Provides type-safe database operations with the defined schema
 */
export const db = drizzle(sql, { schema });
