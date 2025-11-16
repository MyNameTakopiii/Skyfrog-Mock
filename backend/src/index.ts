import { createApp } from "./app";
import { initDB } from "./db";
import { setupGracefulShutdown } from "./shutdown";

const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

async function startServer() {
  try {
    await initDB();

    const app = createApp();

    const server = app.listen(PORT, HOST, () => {
      console.log(`✓ Server running on http://${HOST}:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
    });

    // Attach graceful shutdown handler
    setupGracefulShutdown(server);

  } catch (error) {
    console.error("✗ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
