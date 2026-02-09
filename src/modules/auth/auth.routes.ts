// auth.routes.ts
import { Router } from "express";
import { authrateLimiter } from "../../shared/middleware/security"; 

export const authRouter = Router();

authRouter.use(authrateLimiter); // Apply rate limiter to all auth routes

authRouter.post("/register", (_req, res) => res.status(501).json({ message: "Not implemented" }));
authRouter.post("/login", (_req, res) => res.status(501).json({ message: "Not implemented" }));
authRouter.post("/refresh", (_req, res) => res.status(501).json({ message: "Not implemented" }));
authRouter.post("/logout", (_req, res) => res.status(501).json({ message: "Not implemented" }));