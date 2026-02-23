//orgs.routes.ts
import { Router } from "express";

import { requireAuth } from "../../shared/middleware/requireAuth";
import { requireOrgMatch } from "../../shared/middleware/requireOrgMatch";
import { requireRole } from "../../shared/middleware/requireRole";
import { validate } from "../../shared/middleware/validate";

import { createInviteSchema, acceptInviteSchema } from "./orgs.schemas";
import { createInviteController, acceptInviteController } from "./orgs.controller";


export const orgsRouter = Router();

orgsRouter.get(
    "/:orgId/secure",
    requireAuth,
    requireOrgMatch("orgId"),
    requireRole("member"),
    (req, res) => {
        res.json({
            ok: true,
            message: "Accessgranted to org-secure route",
            user: req.user,
            orgIdRequested: req.params.orgId,
        });
    }
);

// Owner/Admin darf einladen (mindestens admin)
orgsRouter.post(
  "/:orgId/invites",
  requireAuth,
  requireOrgMatch("orgId"),
  requireRole("admin"), // owner/admin ok
  validate({ body: createInviteSchema }),
  createInviteController
);

// eingeloggter User nimmt Invite an (keine org match, weil noch nicht Mitglied)
orgsRouter.post(
  "/invites/accept",
  requireAuth,
  validate({ body: acceptInviteSchema }),
  acceptInviteController
);
