// requireAuth.ts
import type { NextFunction, Request, Response } from "express"; 
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";


type AccessPayLoad = {
    sub: string;
    orgId: string;
    role: string;
};

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next (new AppError("Missing authorization header", 401));
    }
    
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        return next (new AppError("Invalid authorization format", 401));
    }

    try {
        const payload = jwt.verify(token, env.accessTokenSecret) as AccessPayLoad;

        req.user = {
            id: payload.sub,
            orgId: payload.orgId,
            role: payload.role,
        };

        return next();
    } catch (err) {
        return next (new AppError("Invalid or expired token", 401));
    }   
}