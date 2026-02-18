// token.service.ts
import jwt from "jsonwebtoken"; // sign/verify
import crypto from "node:crypto"; // jti + sha256
import { env } from "../../shared/config/env"; // secrets
import { RefreshTokenModel } from "./models/refreshToken.model"; // DB model

export type AccessTokenPayload = {
  sub: string; // userId
  orgId: string;
  role: string;
};

export type RefreshTokenPayload = {
  sub: string; // userId
  jti: string; // token id
};

function hashToken(token: string): string {
  // niemals Klartext speichern
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function issueAccessToken(payload: AccessTokenPayload): string {
  // kurzlebig -> für API Requests
  return jwt.sign(payload, env.accessTokenSecret, { expiresIn: "15m" });
}

export async function issueRefreshToken(userId: string): Promise<{ refreshToken: string; jti: string }> {
  const jti = crypto.randomUUID(); // unique token id

  const refreshToken = jwt.sign(
    { sub: userId, jti }, // payload minimal
    env.refreshTokenSecret,
    { expiresIn: "7d" } // MVP: 7 Tage
  );

  // Ablaufdatum für DB (7 Tage)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // tokenHash speichern (nicht Klartext)
  await RefreshTokenModel.create({
    userId, // Mongoose cast string -> ObjectId
    jti,
    tokenHash: hashToken(refreshToken),
    expiresAt,
  });

  return { refreshToken, jti };
}

export function verifyRefreshToken(refreshToken: string): RefreshTokenPayload {
  // wirft Error, wenn invalid/expired
  return jwt.verify(refreshToken, env.refreshTokenSecret) as RefreshTokenPayload;
}

export async function isRefreshTokenActive(jti: string, refreshToken: string): Promise<boolean> {
  const doc = await RefreshTokenModel.findOne({ jti }).exec();
  if (!doc) return false;

  if (doc.expiresAt.getTime() <= Date.now()) return false;

  // Hash vergleichen
  return doc.tokenHash === hashToken(refreshToken);
}

export async function revokeRefreshToken(jti: string): Promise<void> {
  // Token ungültig machen (Rotation/Logout)
  await RefreshTokenModel.deleteOne({ jti }).exec();
}

