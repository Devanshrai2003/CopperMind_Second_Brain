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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("crypto");
const auth_1 = require("../middleware/auth");
const jwt_1 = require("../utils/jwt");
const userRouter = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
userRouter.post("/guest", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const guestId = (0, crypto_1.randomUUID)();
        const guestUser = yield prisma.user.create({
            data: {
                username: `Guest${guestId.slice(0, 5)}`,
                googleId: `guest_${guestId.slice(0, 5)}`,
                email: `guest_${guestId}@coppermind.local`,
                avatar: "https://api.dicebear.com/9.x/initials/svg?seed=guest?radius=50",
                isGuest: true,
            },
        });
        (0, jwt_1.setAuthCookie)(res, guestUser.id, guestUser.username);
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
        const existingUser = yield prisma.user.findFirst({
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
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${username}?radius=50`,
            },
        });
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        (0, jwt_1.setAuthCookie)(res, user.id, user.username);
        res.status(201).json({
            message: "Account created successfully",
            user: userWithoutPassword,
        });
    }
    catch (error) {
        console.error("error signing up", error);
        res.status(500).json({ error: "Signup failed" });
    }
}));
userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ error: "Missing email or password" });
        return;
    }
    try {
        const user = yield prisma.user.findUnique({ where: { username } });
        if (!user || !user.password) {
            res.status(400).json({ error: "Invalid credentials" });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ error: "Invalid credentials" });
            return;
        }
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        (0, jwt_1.setAuthCookie)(res, user.id, user.username);
        res.status(200).json({
            message: "Login successful",
            user: userWithoutPassword,
        });
    }
    catch (error) {
        console.error("error logging in", error);
        res.status(500).json({ error: "Login failed" });
    }
}));
userRouter.post("/logout", (req, res) => {
    (0, jwt_1.clearAuthCookie)(res);
    res.status(200).json({ message: "Logged out successfully" });
    return;
});
userRouter.get("/me", auth_1.auth, (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
    }
    const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
    res.status(200).json({ user: userWithoutPassword });
});
exports.default = userRouter;
