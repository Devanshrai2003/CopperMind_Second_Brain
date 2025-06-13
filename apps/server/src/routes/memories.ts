import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth";
import { upload } from "../utils/cloudinary";

const memoryRouter = Router();
const prisma = new PrismaClient();

memoryRouter.post("/add-memory", auth, async (req: Request, res: Response) => {
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
    const newMemory = await prisma.memory.create({
      data: {
        title,
        type,
        tags,
        description,
        url,
        shared: shared ?? false,
        userId: user.id,
      },
    });
    res
      .status(201)
      .json({ message: "Memory created successfully", memory: newMemory });
  } catch (error) {
    console.error("Error creating memory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

memoryRouter.post(
  "/add-image",
  auth,
  upload.single("image"),
  (req: Request, res: Response) => {
    try {
      const file = req.file as Express.Multer.File & { path?: string };

      if (!file || !file.path) {
        res.status(400).json({ error: "No image uploaded" });
        return;
      }
      res.status(200).json({ url: file.path });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

memoryRouter.get("/get-memories", auth, async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = 8;
    const skip = (page - 1) * limit;

    const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";
    const search = req.query.search as string;
    const type = req.query.type as string;

    const whereClause: any = {
      userId: user.id,
    };

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { tags: { hasSome: [search] } },
      ];
    }

    if (type && type !== "all") {
      whereClause.type = type;
    }

    const totalMemories = await prisma.memory.count({
      where: whereClause,
    });

    const memories = await prisma.memory.findMany({
      where: whereClause,
      orderBy: {
        createdAt: sortOrder,
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalMemories / limit);

    res.json({
      memories,
      pagination: {
        currentPage: page,
        totalPages,
        totalMemories,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching user memories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

memoryRouter.put(
  "/update-memory/:id",
  auth,
  async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const { title, description, type, tags, url, shared } = req.body;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const existingMemory = await prisma.memory.findUnique({
        where: { id },
      });

      if (!existingMemory || existingMemory.userId !== user.id) {
        res.status(403).json({
          error: "Memory does not exist or is not associated with user",
        });
        return;
      }

      const updatedMemory = await prisma.memory.update({
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
    } catch (error) {
      console.error("Error updating existing memory", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

memoryRouter.delete(
  "/delete-memory/:id",
  auth,
  async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = req.params;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const existingMemory = await prisma.memory.findUnique({
        where: { id },
      });

      if (!existingMemory || existingMemory.userId !== user.id) {
        res.status(403).json({
          error: "Memory does not exist or is not associated with user",
        });
        return;
      }
      await prisma.memory.delete({
        where: { id },
      });

      res.status(200).json({ message: "Memory deleted successfully" });
    } catch (error) {
      console.error("Error deleting memory:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

memoryRouter.get("/shared-memories", async (req: Request, res: Response) => {
  const memories = await prisma.memory.findMany({
    where: { shared: true },
    select: {
      id: true,
      title: true,
      description: true,
      url: true,
      type: true,
      tags: true,
      createdAt: true,
      user: { select: { username: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(memories);
});

// memoryRouter.get(
//   "/get-shared-memories/:userId",
//   async (req: Request, res: Response) => {
//     const { userId } = req.params;

//     try {
//       const sharedMemories = await prisma.memory.findMany({
//         where: {
//           userId,
//           shared: true,
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//       });

//       res.json({ sharedMemories });
//     } catch (error) {
//       console.error("Error fetching shared memories:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   }
// );

memoryRouter.patch(
  "/toggle-share/:id",
  auth,
  async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = req.params;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const existingMemory = await prisma.memory.findUnique({
        where: { id },
      });

      if (!existingMemory || existingMemory.userId !== user.id) {
        res.status(404).json({ error: "Memory not found or unauthorized" });
        return;
      }

      const updatedMemory = await prisma.memory.update({
        where: { id },
        data: {
          shared: !existingMemory.shared,
        },
      });

      res.json({
        message: `Memory is now ${updatedMemory.shared ? "shared" : "private"}`,
        memory: updatedMemory,
      });
    } catch (error) {
      console.error("Error toggling shared status:", error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
);

export default memoryRouter;
