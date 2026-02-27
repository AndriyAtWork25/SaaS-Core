// orgs.members.routes.ts
import { Router } from "express";

import { requireAuth } from "../../shared/middleware/requireAuth";
// requireAuth liest JWT -> setzt req.user

import { requireOrgMatch } from "../../shared/middleware/requireOrgMatch";
// requireOrgMatch verhindert, dass man andere Orgs anspricht

import { requireRole } from "../../shared/middleware/requireRole";
// requireRole blockt, wenn Rolle zu niedrig ist

import { validate } from "../../shared/middleware/validate";
// validate nutzt Zod Schemas -> 400 bei falschem Input

import { changeRoleSchema } from "./orgs.members.schemas";
// Schema für PATCH role

import {
  listMembersController,
  changeMemberRoleController,
  removeMemberController,
} from "./orgs.members.controller";

export const orgMembersRouter = Router();

// Liste Members: admin+ (owner/admin)
orgMembersRouter.get(
  "/:orgId/members",
  requireAuth,
  requireOrgMatch("orgId"),
  requireRole("admin"),
  listMembersController
);

// Rolle ändern: owner/admin
orgMembersRouter.patch(
  "/:orgId/members/:userId/role",
  requireAuth,
  requireOrgMatch("orgId"),
  requireRole("admin"),
  validate({ body: changeRoleSchema }),
  changeMemberRoleController
);

// Member entfernen: owner/admin
orgMembersRouter.delete(
  "/:orgId/members/:userId",
  requireAuth,
  requireOrgMatch("orgId"),
  requireRole("admin"),
  removeMemberController
);