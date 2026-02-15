// auth.controller.ts
import type { Request, Response } from "express";
import { loginService, refreshService, registerService } from "./auth.service";
import { getUserById } from "../users/users.service"; // ✅ für /auth/me

export async function registerController(req: Request, res: Response) {
  const { email, password, orgName } = req.body;

  const result = await registerService({ email, password, orgName });
  res.status(201).json(result);
}

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body;

  const tokens = await loginService({ email, password });
  res.status(200).json({ tokens });
}

export async function refreshController(req: Request, res: Response) {
  const { refreshToken } = req.body;

  const tokens = await refreshService({ refreshToken });
  res.status(200).json({ tokens });
}

// ✅ GET /auth/me (protected)
export async function meController(req: Request, res: Response) {
  // requireAuth middleware setzt req.user
  const authUser = req.user;

  // falls jemand die Middleware vergisst oder Token fehlt
  if (!authUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // user aus in-memory store holen
  const user = getUserById(authUser.id);

  // kann passieren wenn Server neu gestartet wurde (in-memory gelöscht)
  if (!user) {
    return res.status(401).json({ message: "User not found (server restarted?)" });
  }

  return res.status(200).json({
    id: user.id,
    email: user.email,
    orgId: user.orgId,
    role: user.role,
  });
}

