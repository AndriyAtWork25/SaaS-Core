// orgs.members.service.ts
import crypto from "node:crypto";
import { AppError } from "../../shared/errors/AppError";
import { InviteModel } from "./models/invite.model";
import { UserModel } from "../users/models/user.model";

function hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createInviteService(input: {
    orgId: string;
    email: string;
    role: "admin" | "member" | "viewer";
}) {
    const token = crypto.randomBytes(32).toString("hex");

    const tokenHash = hashToken(token);

    // Invite expires in 48 hours
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    await InviteModel.create({
        orgId: input.orgId,
        email: input.email.toLowerCase(),
        role: input.role,
        tokenHash,
        expiresAt,
    });

    return { token, expiresAt };
}

// Invited User accepts the invite using the token
export async function acceptInviteService(input: {
    token: string;
    userId: string;
}) {
    const tokenHash = hashToken(input.token);

    const invite = await InviteModel.findOne({ tokenHash }).exec();
    if (!invite) throw new AppError("Invite not found or expired", 404);

    // Wenn schon angenommen -> Fehler (oder idempotent)
  if (invite.acceptedAt) throw new AppError("Invite already accepted", 409);

  // User laden
  const user = await UserModel.findById(input.userId).exec();
  if (!user) throw new AppError("User not found", 404);

  // Sicherheitsregel: Email des eingeloggten Users muss zur Invite Email passen
  if (user.email.toLowerCase() !== invite.email.toLowerCase()) {
    throw new AppError("Invite email mismatch", 403);
  }

  // User in Org aufnehmen: orgId + role setzen
  user.orgId = invite.orgId;
  user.role = invite.role as any;
  await user.save();

  // Invite markieren als accepted
  invite.acceptedAt = new Date();
  await invite.save();

  return { ok: true };
}
