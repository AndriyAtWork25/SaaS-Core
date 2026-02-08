// errorHandler.ts
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { env } from "../config/env";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    const isAppError = err instanceof AppError;

    const statusCode = isAppError ? err.statusCode : 500;
    const message = isAppError ? err.message : "Internal Server Error";
    
    // In dev: echte Fehlermeldung loggen
    if (env.nodeEnv !== "test") {
        // eslint-disable-next-line no-console
        console.error(err);
    }

    res.status(statusCode).json({
        error: {
            message,
            ...(env.nodeEnv === "development" && !isAppError
                ? { debug: err instanceof Error ? err.message : String(err) }
                : {}),
            },
          });   
        }
