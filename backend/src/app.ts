import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import { authHandler } from "./middleware/auth.js";
import { createRouter } from "./routes/index.js";
import { createV1Router } from "./routes/v1/index.js";
import { AppError } from "./lib/errors.js";

export function createApp(): Express {
  const app = express();

  // Configure CORS for frontend communication
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    }),
  );

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Authentication routes - handle all /api/auth/* routes
  app.use("/api/auth", authHandler);

  // Mount API routes
  app.use("/api", createRouter());
  app.use("/api/v1", createV1Router());

  // 404 handler for undefined routes
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    const error = new AppError("Route not found", 404, "NOT_FOUND");
    next(error);
  });

  // Global error handling middleware
  app.use(
    (
      err: Error | AppError,
      _req: Request,
      res: Response,
      _next: NextFunction,
    ) => {
      // Log error details
      console.error("Error:", {
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });

      // Handle custom AppError instances
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({
          error: {
            message: err.message,
            code: err.code,
            status: err.statusCode,
          },
        });
      }

      // Handle generic errors
      res.status(500).json({
        error: {
          message:
            process.env.NODE_ENV === "production"
              ? "Internal server error"
              : err.message || "Internal server error",
          code: "INTERNAL_ERROR",
          status: 500,
        },
      });
    },
  );

  return app;
}
