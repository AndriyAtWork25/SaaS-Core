//requireOrgMatch.ts
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

export function requireOrgMatch(paramname: string = "orgId") {
    return (req: Request, _res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            return next(new AppError("Unauthorized", 401));
        }

        const requestedOrgId = req.params[paramname];

        if (!requestedOrgId) {
            return next(new AppError(`Missing param: ${paramname}`, 400));
        }

        if (user.orgId !== requestedOrgId) {
            return next(new AppError("Forbidden (cross-tenant access)", 403));
        }

        return next();
    };
}