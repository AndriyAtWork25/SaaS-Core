// app.ts
import express from 'express';
import { env } from "./shared/config/env";
import { errorHandler } from "./shared/middleware/errorHandler";
import { authRouter } from "./modules/auth/auth.routes";
import { helmetMiddleware, apiRateLimiter } from "./shared/middleware/security";
import { orgsRouter } from "./modules/orgs/orgs.routes";

export const app = express();

app.use(helmetMiddleware);
app.use(apiRateLimiter);

app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({ status: "ok", env: env.nodeEnv });
});

app.use("/auth", authRouter);

app.use(errorHandler);

app.use("/orgs", orgsRouter);