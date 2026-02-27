//orgs.members.controller.ts
// orgs.members.controller.ts
import type { Request, Response } from "express";
import { AppError } from "../../shared/errors/AppError";

import {
  listMembersService,
  changeMemberRoleService,
  removeMemberService,
} from "./orgs.members.management.service";

// Rolle-Typ (muss zu deinem System passen)
type Role = "owner" | "admin" | "member" | "viewer";

// Das ist das, was requireAuth in req.user setzt
type AuthUser = {
  id: string;
  orgId: string;
  role: Role;
  email?: string;
};

// GET /orgs/:orgId/members
export async function listMembersController(
  req: Request<{ orgId: string }>,
  res: Response
) {
  const { orgId } = req.params; // ✅ orgId ist jetzt string

  const members = await listMembersService(orgId);
  res.status(200).json({ members });
}

// PATCH /orgs/:orgId/members/:userId/role
export async function changeMemberRoleController(
  req: Request<{ orgId: string; userId: string }, any, { role: Role }>,
  res: Response
) {
  const { orgId, userId: targetUserId } = req.params;

  const actor = req.user as AuthUser | undefined; // ✅ TS kennt req.user nicht -> cast
  if (!actor) throw new AppError("Unauthorized", 401);

  const { role } = req.body; // ✅ role ist Role (wegen generics oben)

  const updated = await changeMemberRoleService({
    orgId,
    targetUserId,
    newRole: role,
    actorUserId: actor.id,
  });

  res.status(200).json(updated);
}

// DELETE /orgs/:orgId/members/:userId
export async function removeMemberController(
  req: Request<{ orgId: string; userId: string }>,
  res: Response
) {
  const { orgId, userId: targetUserId } = req.params;

  const actor = req.user as AuthUser | undefined;
  if (!actor) throw new AppError("Unauthorized", 401);

  const result = await removeMemberService({
    orgId,
    targetUserId,
    actorUserId: actor.id,
  });

  res.status(200).json(result);
}