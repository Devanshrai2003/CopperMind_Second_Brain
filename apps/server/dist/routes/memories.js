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
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const cloudinary_1 = require("../utils/cloudinary");
const memoryRouter = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
memoryRouter.post("/add-memory", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { title, tags, type, description, url, shared } = req.body;
    if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    if (!title || !type || !description) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }
    try {
        const newMemory = yield prisma.memory.create({
            data: {
                title,
                type,
                tags,
                description,
                url,
                shared: shared !== null && shared !== void 0 ? shared : false,
                userId: user.id,
            },
        });
        res
            .status(201)
            .json({ message: "Memory created successfully", memory: newMemory });
    }
    catch (error) {
        console.error("Error creating memory:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
memoryRouter.post("/add-image", auth_1.auth, cloudinary_1.upload.single("image"), (req, res) => {
    try {
        const file = req.file;
        if (!file || !file.path) {
            res.status(400).json({ error: "No image uploaded" });
            return;
        }
        res.status(200).json({ url: file.path });
    }
    catch (error) {
        console.error("Image upload error:", error);
        res.status(500).json({ error: "Upload failed" });
    }
});
memoryRouter.get("/get-memories", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const memories = yield prisma.memory.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json({ memories });
    }
    catch (error) {
        console.error("Error fetching user memories:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
memoryRouter.put("/update-memory/:id", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const { title, description, type, tags, url, shared } = req.body;
    if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const existingMemory = yield prisma.memory.findUnique({
            where: { id },
        });
        if (!existingMemory || existingMemory.userId !== user.id) {
            res.status(403).json({
                error: "Memory does not exist or is not associated with user",
            });
            return;
        }
        const updatedMemory = yield prisma.memory.update({
            where: { id },
            data: {
                title,
                description,
                type,
                tags,
                url,
                shared,
            },
        });
        res.status(200).json({
            message: "Memory updated successfully",
            memory: updatedMemory,
        });
    }
    catch (error) {
        console.error("Error updating existing memory", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
memoryRouter.delete("/delete-memory/:id", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const existingMemory = yield prisma.memory.findUnique({
            where: { id },
        });
        if (!existingMemory || existingMemory.userId !== user.id) {
            res.status(403).json({
                error: "Memory does not exist or is not associated with user",
            });
            return;
        }
        yield prisma.memory.delete({
            where: { id },
        });
        res.status(200).json({ message: "Memory deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting memory:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
memoryRouter.get("/get-shared-memories/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const sharedMemories = yield prisma.memory.findMany({
            where: {
                userId,
                shared: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json({ sharedMemories });
    }
    catch (error) {
        console.error("Error fetching shared memories:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
memoryRouter.patch("/toggle-share/:id", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const existingMemory = yield prisma.memory.findUnique({
            where: { id },
        });
        if (!existingMemory || existingMemory.userId !== user.id) {
            res.status(404).json({ error: "Memory not found or unauthorized" });
            return;
        }
        const updatedMemory = yield prisma.memory.update({
            where: { id },
            data: {
                shared: !existingMemory.shared,
            },
        });
        res.json({
            message: `Memory is now ${updatedMemory.shared ? "shared" : "private"}`,
            memory: updatedMemory,
        });
    }
    catch (error) {
        console.error("Error toggling shared status:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
}));
exports.default = memoryRouter;
