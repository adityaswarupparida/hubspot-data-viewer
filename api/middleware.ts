import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config";

export const middleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;  // "Bearer <token>"
    if (!header) {
        return res.status(403).json({
            message: "Missing Authorization Bearer token"
        });
    }

    const parts = header.trim().split(" ");
    if (parts.length !== 2 || parts[0] !== `Bearer`) {
        return res.status(401).json({
            message: "Invalid Authorization header" 
        });
    }

    const token = parts[1];
    if (token) {
        const decodedData = jwt.verify(token, JWT_SECRET)
        req.userId = (decodedData as JwtPayload).sub;
        next();
    }
}