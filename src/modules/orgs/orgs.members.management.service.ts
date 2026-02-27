// orgs.members.management.service.ts
import { AppError } from "../../shared/errors/AppError";
// AppError = unser standard error mit HTTP code

import { UserModel } from "../users/models/user.model";
// UserModel = Mongo Collection "users"

type Role = "owner" | "admin" | "member" | "viewer";
// einfacher Role type (gleich wie bei roles.ts)

// 1) Mitglieder einer Org auflisten
export async function listMembersService(orgId: string) {
  // Wir holen alle User, die orgId == orgId haben
  // select(...) = nur Felder zurückgeben, die wir zeigen wollen
  const members = await UserModel.find({ orgId })
    .select("_id email role orgId createdAt updatedAt")
    .lean()
    .exec();

  // Wir normalisieren _id -> id (für sauberes API Response)
  return members.map((m) => ({
    id: String(m._id),
    email: m.email,
    role: m.role,
    orgId: String(m.orgId),
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  }));
}

// 2) Rolle eines Users ändern
export async function changeMemberRoleService(input: {
  orgId: string;
  targetUserId: string;
  newRole: Role;
  actorUserId: string; // wer macht das (für Regeln)
}) {
  // Actor = eingeloggter User, der gerade die Änderung macht
  const actor = await UserModel.findById(input.actorUserId).exec();
  if (!actor) throw new AppError("Actor not found", 404);

  // Sicherheitscheck: Actor muss in derselben Org sein
  if (String(actor.orgId) !== input.orgId) {
    throw new AppError("Forbidden (cross-tenant)", 403);
  }

  // Target = User, dessen Rolle geändert wird
  const target = await UserModel.findById(input.targetUserId).exec();
  if (!target) throw new AppError("Target user not found", 404);

  // Sicherheitscheck: Target muss in derselben Org sein
  if (String(target.orgId) !== input.orgId) {
    throw new AppError("Target not in this org", 403);
  }

  // Regel: Owner Rolle darf man nicht einfach ändern (MVP)
  // -> Sonst könntest du dich selbst “ent-owen”
  if (target.role === "owner") {
    throw new AppError("Cannot change role of owner", 403);
  }

  // Neue Rolle setzen
  target.role = input.newRole as any;
  await target.save();

  return {
    id: String(target._id),
    email: target.email,
    role: target.role,
    orgId: String(target.orgId),
  };
}

// 3) Member entfernen (Org verlassen lassen / rauskicken)
export async function removeMemberService(input: {
  orgId: string;
  targetUserId: string;
  actorUserId: string;
}) {
  const actor = await UserModel.findById(input.actorUserId).exec();
  if (!actor) throw new AppError("Actor not found", 404);

  if (String(actor.orgId) !== input.orgId) {
    throw new AppError("Forbidden (cross-tenant)", 403);
  }

  const target = await UserModel.findById(input.targetUserId).exec();
  if (!target) throw new AppError("Target user not found", 404);

  if (String(target.orgId) !== input.orgId) {
    throw new AppError("Target not in this org", 403);
  }

  // Owner darf nicht entfernt werden (MVP)
  if (target.role === "owner") {
    throw new AppError("Cannot remove owner", 403);
  }

  // Optional: nicht erlauben, dass man sich selbst entfernt (MVP)
  if (String(target._id) === String(actor._id)) {
    throw new AppError("Use 'leave org' endpoint for self-removal", 400);
  }

  // Wir setzen orgId auf null / entfernen membership
  // (MVP) -> Alternative wäre: orgId behalten und "disabled" setzen
  target.orgId = null as any;
  target.role = "viewer" as any; // fallback role
  await target.save();

  return { ok: true };
}