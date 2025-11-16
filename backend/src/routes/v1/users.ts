import { Router, type Request, type Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { prisma } from "../../lib/prisma.js";
import { NotFoundError } from "../../lib/errors.js";

export const usersRouter = Router();

// GET /api/v1/users - Get all users
usersRouter.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    res.json({ data: users });
  }),
);

// GET /api/v1/users/:id - Get user by ID
usersRouter.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    res.json({ data: user });
  }),
);
