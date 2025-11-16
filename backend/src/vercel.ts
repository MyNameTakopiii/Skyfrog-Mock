import { createApp } from "./app.js";
import { connectDatabase } from "./lib/prisma.js";

// Initialize database connection
connectDatabase().catch((error) => {
  console.error("Failed to connect to database:", error);
});

// Export the Express app for Vercel serverless
export default createApp();
