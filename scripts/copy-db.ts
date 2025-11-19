import { copyFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// local DB (root)
const sourceDb = join(__dirname, "..", "data.db");

// production DB (.data)
const targetDb = join(__dirname, "..", ".data", "data.db");

console.log("📦 Copy DB to .data folder (Nuxthub)...");

if (!existsSync(sourceDb)) {
  console.error("❌ data.db not found!");
  console.log("💡 Run: bunx drizzle-kit push && bun run db:seed");
  process.exit(1);
}

// Ensure .data directory exists
mkdirSync(dirname(targetDb), { recursive: true });

// Copy DB file
copyFileSync(sourceDb, targetDb);

console.log("✅ Done! Database copied:");
console.log("   Source:", sourceDb);
console.log("   Target:", targetDb);
