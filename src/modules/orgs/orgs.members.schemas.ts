//orgs.members.schemas.ts
import { z } from "zod";

export const roleSchema = z.enum(["owner", "admin", "member"]);

export const changeRoleSchema = z.object({
    role: roleSchema,
});