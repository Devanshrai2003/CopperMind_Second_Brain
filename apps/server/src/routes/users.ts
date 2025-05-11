import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { auth } from "../middleware/auth";
import { setAuthCookie, clearAuthCookie } from "../utils/jwt";

const userRouter = Router();
const prisma = new PrismaClient();

userRouter.post("/guest", async (req: Request, res: Response) => {
  try {
    const guestId = randomUUID();

    const guestUser = await prisma.user.create({
      data: {
        username: `Guest${guestId.slice(0, 5)}`,
        googleId: `guest_${guestId.slice(0, 5)}`,
        email: `guest_${guestId}@coppermind.local`,
        avatar:
          "https://api.dicebear.com/9.x/initials/svg?seed=guest?radius=50",
        isGuest: true,
      },
    });

    setAuthCookie(res, guestUser.id, guestUser.username);

    res.json({
      message: "Guest account created",
      user: guestUser,
    });
  } catch (error) {
    console.error("error creating guest account", error);
    res.status(500).json({ error: "guest account creation failed" });
  }
});

userRouter.post("/signup", async (req: Request, res: Response) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    res.status(400).json({ message: "Missing fields" });
    return;
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      res.status(400).json({
        error: "User with this email or username already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${username}?radius=50`,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    setAuthCookie(res, user.id, user.username);

    res.status(201).json({
      message: "Account created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("error signing up", error);
    res.status(500).json({ error: "Signup failed" });
  }
});

userRouter.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Missing email or password" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !user.password) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const { password: _, ...userWithoutPassword } = user;

    setAuthCookie(res, user.id, user.username);

    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("error logging in", error);
    res.status(500).json({ error: "Login failed" });
  }
});

userRouter.post("/logout", (req: Request, res: Response) => {
  clearAuthCookie(res);
  res.status(200).json({ message: "Logged out successfully" });
  return;
});

userRouter.get("/me", auth, (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ error: "User not authenticated" });
    return;
  }

  const { password: _, ...userWithoutPassword } = user;

  res.status(200).json({ user: userWithoutPassword });
});

export default userRouter;
