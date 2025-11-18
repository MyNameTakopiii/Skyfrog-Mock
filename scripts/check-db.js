import Database from "better-sqlite3";

const db = new Database("data.db");

console.log("📊 Checking database schema...\n");

// Get all tables
const tables = db
  .prepare(
    `
  SELECT name FROM sqlite_master 
  WHERE type='table' 
  ORDER BY name
`,
  )
  .all();

console.log("Tables:", tables.map((t) => t.name).join(", "));
console.log("");

// Check users table
try {
  const usersInfo = db.prepare("PRAGMA table_info(users)").all();
  console.log("✅ Users table columns:");
  usersInfo.forEach((col) => {
    console.log(`   - ${col.name}: ${col.type}`);
  });
} catch {
  console.log("❌ Users table not found");
}

console.log("");

// Check products table
try {
  const productsInfo = db.prepare("PRAGMA table_info(products)").all();
  console.log("✅ Products table columns:");
  productsInfo.forEach((col) => {
    console.log(`   - ${col.name}: ${col.type}`);
  });
} catch {
  console.log("❌ Products table not found");
}

console.log("");

// Check orders table
try {
  const ordersInfo = db.prepare("PRAGMA table_info(orders)").all();
  console.log("✅ Orders table columns:");
  ordersInfo.forEach((col) => {
    console.log(`   - ${col.name}: ${col.type}`);
  });
} catch {
  console.log("❌ Orders table not found");
}

db.close();
