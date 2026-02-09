// auth.routes.ts
import { Router } from "express";
import { authrateLimiter } from "../../shared/middleware/security"; 
import { validate } from "../../shared/middleware/validate";
import { loginSchema, registerSchema } from "./auth.schemas";

export const authRouter = Router();

authRouter.use(authrateLimiter); // Apply rate limiter to all auth routes

authRouter.post(
  "/register",
  validate({ body: registerSchema }),
  

  (_req, res) => {
    res.status(501).json({ message: "Register not implemented" });
  }
);

authRouter.post(
  "/login",
  validate({ body: loginSchema }),

  (_req, res) => {
    res.status(501).json({ message: "Login not implemented" });
  }
);

authRouter.post("/refresh", (_req, res) => {
  res.status(501).json({ message: "Refresh not implemented" });
});

authRouter.post("/logout", (_req, res) => {
  res.status(501).json({ message: "Logout not implemented" });
});