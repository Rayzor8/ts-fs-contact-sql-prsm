import { Request, Response, NextFunction } from "express";
import { prisma } from "../applications/database";
import { CustomRequest } from "../types/request-type";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.get("Authorization");
    if (!token) {
      res.status(401).json({ errors: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findFirst({ where: { token } });

    if (!user) {
      res.status(401).json({ errors: "Unauthorized" });
      return;
    }

    (req as CustomRequest).user = user;
    
    return next();
  } catch (error) {
    console.error("Auth middleware error:", error);
  }
};
