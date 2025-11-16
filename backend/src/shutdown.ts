import { closeDB } from "./db";
import type { Server } from "http";

export function setupGracefulShutdown(server: Server) {
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received, shutting down gracefully...`);

    server.close(async () => {
      console.log("✓ HTTP server closed");

      try {
        await closeDB();
        console.log("✓ Graceful shutdown complete");
        process.exit(0);
      } catch (error) {
        console.error("✗ Error during shutdown:", error);
        process.exit(1);
      }
    });

    setTimeout(() => {
      console.error("✗ Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}
