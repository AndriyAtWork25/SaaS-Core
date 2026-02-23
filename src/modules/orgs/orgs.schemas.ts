//orgs.schemas.ts
import { z } from "zod";

export const createInviteSchema = z.object({
    email: z.string().email(),
    role: z.enum(["admin", "member", "viewer"]).default("member"),
});

export const acceptInviteSchema = z.object({
    token: z.string().min(10),
});