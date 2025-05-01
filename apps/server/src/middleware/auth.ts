import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function auth(req: Request, res: Response, next: NextFunction) {
  const id = req.cookies?.userId;

  if (!id) {
    res.status(401).json({
      message: "User not authenticated",
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      res.status(401).json({ error: "Invalid user ID" });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: "Failed to authenticate user" });
    return;
  }
}
