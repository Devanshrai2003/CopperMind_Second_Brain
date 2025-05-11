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
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
const client_1 = require("@prisma/client");
const jwt_1 = require("../utils/jwt");
const prisma = new client_1.PrismaClient();
function auth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            res.status(401).json({
                message: "User not authenticated",
            });
            return;
        }
        try {
            const decoded = (0, jwt_1.verifyToken)(token);
            const user = yield prisma.user.findUnique({
                where: { id: decoded.id },
            });
            if (!user) {
                res.status(401).json({ error: "Invalid user" });
                return;
            }
            req.user = user;
            next();
        }
        catch (error) {
            if (error.name === "TokenExpiredError") {
                res.status(401).json({ error: "Token expired" });
            }
            else if (error.name === "JsonWebTokenError") {
                res.status(401).json({ error: "Invalid token" });
            }
            else {
                console.error("Authentication error:", error);
                res.status(500).json({ error: "Failed to authenticate user" });
            }
            return;
        }
    });
}
