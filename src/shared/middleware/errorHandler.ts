// errorHandler.ts
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { env } from "../config/env";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    const isAppError = err instanceof AppError;

    const statusCode = isAppError ? err.statusCode : 500;
    const message = isAppError ? err.message : "Internal Server Error";


    if (env.nodeEnv !== "test") {
        console.error("[ERROR_HANDLER]", err);
    }

    const debug =
        env.nodeEnv === "development" && !isAppError
            ? err instanceof Error
                ? err.message
                : String(err)
            : undefined;

    return res.status(statusCode).json({
        error: {
            message,
            ...(debug ? {debug} : {}),
        },
    });
}
