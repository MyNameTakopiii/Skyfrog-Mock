import { connectDatabase, disconnectDatabase } from "./lib/prisma";

export async function initDB() {
  try {
    await connectDatabase();
    console.log("✓ Database connected");
  } catch (error) {
    console.error("✗ Failed to connect database:", error);
    throw error;
  }
}

export async function closeDB() {
  try {
    await disconnectDatabase();
    console.log("✓ Database disconnected");
  } catch (error) {
    console.error("✗ Failed to disconnect database:", error);
    throw error;
  }
}
