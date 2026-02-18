// auth.schemas.ts
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  orgName: z.string().min(2),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
  // Refresh Token muss mitgesendet werden (später Cookie)
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1),
});
