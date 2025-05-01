import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

const userRouter = Router();
const prisma = new PrismaClient();

function sendAuthCookie(res: Response, userId: string) {
  res.cookie("auth_token", userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  });
}

userRouter.post("/guest", async (req: Request, res: Response) => {
  try {
    const guestId = randomUUID();

    const guestUser = await prisma.user.create({
      data: {
        username: "Guest",
        googleId: `guest_${guestId.slice(0, 5)}`,
        email: `guest_${guestId}@coppermind.local`,
        avatar:
          "https://api.dicebear.com/9.x/initials/svg?seed=guest?radius=50",
        isGuest: true,
      },
    });

    sendAuthCookie(res, guestUser.id);

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
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    sendAuthCookie(res, user.id);

    res.status(201).json({
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    console.error("error signing up", error);
    res.status(500).json({ error: "Signup failed" });
  }
});

userRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Missing email or password" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    sendAuthCookie(res, user.id);

    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("error logging in", error);
    res.status(500).json({ error: "Login failed" });
  }
});

export default userRouter;
