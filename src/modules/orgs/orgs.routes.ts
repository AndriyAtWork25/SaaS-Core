//orgs.routes.ts
import { Router } from "express";
import { requireAuth } from "../../shared/middleware/requireAuth";
import { requireOrgMatch } from "../../shared/middleware/requireOrgMatch";
import { requireRole } from "../../shared/middleware/requireRole";

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
