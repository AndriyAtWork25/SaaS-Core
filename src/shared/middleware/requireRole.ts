//requireRole.ts
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { ROLE_RANK, type Role } from "../auth/roles";

export function requireRole(minRole: Role) {
    return (req: Request, _res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            return next(new AppError("Unauthorized", 401));
        }

        const userRole = user.role as Role;

        if (!(userRole in ROLE_RANK)) {
            return next(new AppError("Invalid user role", 403));
        }

        if (ROLE_RANK[userRole] < ROLE_RANK[minRole]) {
            return next(new AppError("Forbidden", 403));
        }

        return next();
    };
}