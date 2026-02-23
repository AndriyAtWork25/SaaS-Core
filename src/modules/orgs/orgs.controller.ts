// orgs.controller.ts
import type { Request, Response } from "express";
import { AppError } from "../../shared/errors/AppError";
import { createInviteService, acceptInviteService } from "./orgs.members.service";

// Typ für req.user (nur was wir brauchen)
type AuthUser = {
  id: string;
  orgId: string;
  role: string;
  email?: string;
};

export async function createInviteController(
  req: Request<{ orgId: string }, any, { email: string; role: "admin" | "member" | "viewer" }>,
  res: Response
) {
  const orgId = req.params.orgId; // ✅ jetzt garantiert string

  if (!orgId) {
    throw new AppError("Missing orgId param", 400);
  }

  const { email, role } = req.body;

  const result = await createInviteService({ orgId, email, role });
  res.status(201).json(result);
}

export async function acceptInviteController(
  req: Request<any, any, { token: string }>,
  res: Response
) {
  const { token } = req.body;

  const user = req.user as AuthUser | undefined; // ✅ TS-sicher, auch wenn types noch nicht sauber sind
  if (!user) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await acceptInviteService({ token, userId: user.id });
  res.status(200).json(result);
}