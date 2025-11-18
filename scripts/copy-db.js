import { copyFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceDb = join(__dirname, "..", "data.db");
const targetDb = join(__dirname, "..", ".output", "server", "data.db");

console.log("📦 Copying database file to build output...");

if (!existsSync(sourceDb)) {
  console.error("❌ Source database not found:", sourceDb);
  console.log("💡 Run: bunx drizzle-kit push && bun run db:seed");
  process.exit(1);
}

// Ensure target directory exists
const targetDir = dirname(targetDb);
if (!existsSync(targetDir)) {
  mkdirSync(targetDir, { recursive: true });
}

// Copy database file
copyFileSync(sourceDb, targetDb);

console.log("✅ Database copied successfully!");
console.log("   From:", sourceDb);
console.log("   To:", targetDb);
