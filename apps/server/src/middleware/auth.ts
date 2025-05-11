import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../utils/jwt";

const prisma = new PrismaClient();

export async function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({
      message: "User not authenticated",
    });
    return;
  }

  try {
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid user" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if ((error as Error).name === "TokenExpiredError") {
      res.status(401).json({ error: "Token expired" });
    } else if ((error as Error).name === "JsonWebTokenError") {
      res.status(401).json({ error: "Invalid token" });
    } else {
      console.error("Authentication error:", error);
      res.status(500).json({ error: "Failed to authenticate user" });
    }
    return;
  }
}
