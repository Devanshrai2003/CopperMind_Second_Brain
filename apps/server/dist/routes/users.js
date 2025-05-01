"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("crypto");
const userRouter = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
function sendAuthCookie(res, userId) {
    res.cookie("auth_token", userId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });
}
userRouter.post("/guest", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const guestId = (0, crypto_1.randomUUID)();
        const guestUser = yield prisma.user.create({
            data: {
                username: "Guest",
                googleId: `guest_${guestId.slice(0, 5)}`,
                email: `guest_${guestId}@coppermind.local`,
                avatar: "https://api.dicebear.com/9.x/initials/svg?seed=guest?radius=50",
                isGuest: true,
            },
        });
        sendAuthCookie(res, guestUser.id);
        res.json({
            message: "Guest account created",
            user: guestUser,
        });
    }
    catch (error) {
        console.error("error creating guest account", error);
        res.status(500).json({ error: "guest account creation failed" });
    }
}));
userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        res.status(400).json({ message: "Missing fields" });
        return;
    }
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield prisma.user.create({
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
    }
    catch (error) {
        console.error("error signing up", error);
        res.status(500).json({ error: "Signup failed" });
    }
}));
userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "Missing email or password" });
        return;
    }
    try {
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            res.status(400).json({ error: "Invalid credentials" });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ error: "Invalid credentials" });
            return;
        }
        sendAuthCookie(res, user.id);
        res.status(200).json({
            message: "Login successful",
            user,
        });
    }
    catch (error) {
        console.error("error logging in", error);
        res.status(500).json({ error: "Login failed" });
    }
}));
exports.default = userRouter;
