import { User } from "@prisma/client";
import "express";

declare module "express" {
  export interface Request {
    cookies: Record<string, string>;
    user?: User;
  }
}
