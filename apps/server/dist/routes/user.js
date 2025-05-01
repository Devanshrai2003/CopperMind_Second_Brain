"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
const userRouter = (0, express_1.Router)();
console.log("userRouter type:", typeof userRouter);
const prisma = new client_1.PrismaClient();
function sendAuthCookie(res, userId) {
    res.cookie("auth_token", userId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });
}
exports.default = userRouter;
