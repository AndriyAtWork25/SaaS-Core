// validate.ts
import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "../errors/AppError";

type ValidateSchemas = {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
};

export function validate(schemas: ValidateSchemas) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
           if (schemas.body) {
                req.body = schemas.body.parse(req.body);
           }

           const anyReq = req as any; // Type assertion to access query and params

           if (schemas.query) {
                anyReq.validatedQuery = schemas.query.parse(req.query);
              }

              if (schemas.params) {
                anyReq.validatedParams = schemas.params.parse(req.params);
              }

            next();
        } catch (_err) {
            next(new AppError("Validation failed", 400));
        }
    };
}