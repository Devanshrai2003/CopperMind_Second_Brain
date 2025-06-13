import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";

const app = express();
const prisma = new PrismaClient();

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,
  })
);

import userRouter from "./routes/users";
app.use("/api/users", userRouter);

import memoryRouter from "./routes/memories";
app.use("/api/memories", memoryRouter);

app.get("/", (req, res) => {
  res.json({ status: "CopperMind is live" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
