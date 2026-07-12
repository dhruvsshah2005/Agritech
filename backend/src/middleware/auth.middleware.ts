import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from "../config/env";

export function verifyJwtToken(token: string): any {
  if (!config.supabaseJwtSecret) {
    throw new Error("SUPABASE_JWT_SECRET is missing");
  }

  return jwt.verify(token, config.supabaseJwtSecret, {
    algorithms: ["HS256"],
    audience: "authenticated",
  });
}

export function authenticateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ detail: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    const user = verifyJwtToken(token);
    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ detail: "Invalid or expired token" });
  }
}
