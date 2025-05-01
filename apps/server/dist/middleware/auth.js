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
const prisma = new client_1.PrismaClient();
function auth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const id = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.userId;
        if (!id) {
            res.status(401).json({
                message: "User not authenticated",
            });
            return;
        }
        try {
            const user = yield prisma.user.findUnique({ where: { id } });
            if (!user) {
                res.status(401).json({ error: "Invalid user ID" });
                return;
            }
            req.user = user;
            next();
        }
        catch (err) {
            res.status(500).json({ error: "Failed to authenticate user" });
            return;
        }
    });
}
