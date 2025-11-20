import { copyFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const cwd = process.cwd();

const source = join(cwd, "data.db");
const target = join(cwd, ".output", "server", ".data", "data.db");

console.log("📦 Copying SQLite database...");

if (!existsSync(source)) {
  console.error("❌ data.db not found. Did you run `bunx drizzle-kit push`?");
  process.exit(1);
}

mkdirSync(join(cwd, ".output", "server", ".data"), { recursive: true });

copyFileSync(source, target);

console.log("✅ Copied to", target);
