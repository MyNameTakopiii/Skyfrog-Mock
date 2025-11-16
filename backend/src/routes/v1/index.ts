import { Router } from "express";
import { usersRouter } from "./users.js";

export function createV1Router(): Router {
  const router = Router();

  // Mount v1 routes
  router.use("/users", usersRouter);

  return router;
}
