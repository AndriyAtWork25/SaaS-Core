// auth.routes.ts
import { Router } from "express"; // Router für /auth/*
import { authrateLimiter } from "../../shared/middleware/security"; // richtiger Name
import { validate } from "../../shared/middleware/validate"; // Zod-Validation Middleware
import { loginSchema, registerSchema } from "./auth.schemas"; // Zod Schemas
import { registerController } from "./auth.controller"; // Register Controller

export const authRouter = Router();

authRouter.use(authrateLimiter); 


authRouter.post(
  "/register",
  validate({ body: registerSchema }), 
  registerController 
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
