import { User } from "@prisma/client";

export {};

declare global {
  namespace Express {
    interface Request {
      cookies: Record<string, string>;
      user?: User;
    }
  }
}
