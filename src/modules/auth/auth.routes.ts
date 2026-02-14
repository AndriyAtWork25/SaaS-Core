// auth.routes.ts
import { Router } from "express"; // Router für /auth/*
import { authRateLimiter } from "../../shared/middleware/security"; // ✅ richtiger Name
import { validate } from "../../shared/middleware/validate"; // Validiert Requests via Zod
import { loginSchema, refreshSchema, registerSchema } from "./auth.schemas"; // Schemas
import { loginController, refreshController, registerController } from "./auth.controller"; // ✅ alle Controller

export const authRouter = Router();

authRouter.use(authRateLimiter); // ✅ Rate limit auf alle /auth routes

authRouter.post("/register", validate({ body: registerSchema }), registerController);

authRouter.post("/login", validate({ body: loginSchema }), loginController);

authRouter.post("/refresh", validate({ body: refreshSchema }), refreshController);

authRouter.post("/logout", (_req, res) => {
  res.status(501).json({ message: "Logout not implemented" });
});
