import jwt from "jsonwebtoken";
import { Response } from "express";

export interface JwtPayload {
  id: string;
  username: string;
  iat?: number;
  exp?: number;
}

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "none" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export function generateToken(userId: string, username: string): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  return jwt.sign({ id: userId, username }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function setAuthCookie(
  res: Response,
  userId: string,
  username: string
): string {
  const token = generateToken(userId, username);
  res.cookie("token", token, COOKIE_OPTIONS);
  return token;
}

export function verifyToken(token: string): JwtPayload {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  return jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
}
