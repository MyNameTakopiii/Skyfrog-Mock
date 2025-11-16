import { Router, type Request, type Response } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { prisma } from "../lib/prisma.js";

export function createRouter(): Router {
  const router = Router();

  // Health check endpoint at /api/health
  router.get(
    "/health",
    asyncHandler(async (_req: Request, res: Response) => {
      // Check database connection
      await prisma.$queryRaw`SELECT 1`;

      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        database: "connected",
      });
    }),
  );

  return router;
}
