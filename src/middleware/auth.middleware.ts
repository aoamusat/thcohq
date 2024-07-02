// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (request: Request, response: Response, next: NextFunction) => {
  const token = request.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    // @ts-ignore
    request.user = decoded;
    next();
  } catch (error) {
    response.status(401).json({ message: "Invalid token" });
  }
};
