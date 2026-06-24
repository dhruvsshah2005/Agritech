import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

/**
 * Verify Supabase JWT (HS256)
 */
function verifyJwtToken(token: string): any {
    const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

    if (!SUPABASE_JWT_SECRET) {
        throw new Error("JWT secret not found");
    }

    const payload = jwt.verify(token, SUPABASE_JWT_SECRET, {
        algorithms: ["HS256"],
        audience: "authenticated"
    });

    return payload;
}

/**
 * Express auth middleware
 */
export function authenticateUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                detail: "Authorization token missing"
            });
        }

        const token = authHeader.split(" ")[1];

        const user = verifyJwtToken(token);

        // attach user payload
        (req as any).user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            detail: "Invalid or expired token"
        });
    }
}
