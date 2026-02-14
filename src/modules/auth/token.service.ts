// token.service.ts
import jwt from "jsonwebtoken"; // JWT sign/verify
import crypto from "node:crypto"; // randomUUID + sha256 hash
import { env } from "../../shared/config/env"; // Secrets

// Payload im Access Token (kurzlebig)
// -> API kann damit User/Org/Rolle erkennen
export type AccessTokenPayload = {
  sub: string; // userId (JWT Standard claim)
  orgId: string;
  role: string;
};

// Payload im Refresh Token (langlebig)
// -> minimal halten, nur userId + tokenId
export type RefreshTokenPayload = {
  sub: string; // userId
  jti: string; // token id (für revoke/rotation)
};

// In-memory: jti -> hash(refreshToken)
// -> später wird das in DB gespeichert
const refreshTokenHashByJti = new Map<string, string>();

function hashToken(token: string): string {
  // Wir speichern NIE den Refresh Token im Klartext
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function issueAccessToken(payload: AccessTokenPayload): string {
  // Signiert den Access Token mit Secret + kurzer Expiry
  return jwt.sign(payload, env.accessTokenSecret, {
    expiresIn: "15m",
  });
}

export function issueRefreshToken(userId: string): { refreshToken: string; jti: string } {
  const jti = crypto.randomUUID();
  // eindeutige ID für diesen Refresh Token (Rotation/Revocation)

  const refreshToken = jwt.sign(
    { sub: userId, jti }, // Refresh Token payload
    env.refreshTokenSecret,
    { expiresIn: "7d" } // längerlebig
  );

  refreshTokenHashByJti.set(jti, hashToken(refreshToken));
  // serverseitig merken, welcher Token (gehasht) gültig ist

  return { refreshToken, jti }; // ✅ genau so (refreshToken groß T)
}

export function verifyRefreshToken(refreshToken: string): RefreshTokenPayload {
  // Prüft Signatur + Ablaufdatum
  return jwt.verify(refreshToken, env.refreshTokenSecret) as RefreshTokenPayload;
}

export function isRefreshTokenActive(jti: string, refreshToken: string): boolean {
  const storedHash = refreshTokenHashByJti.get(jti);
  if (!storedHash) return false;
  return storedHash === hashToken(refreshToken);
  // Token ist nur gültig, wenn Hash übereinstimmt
}

export function revokeRefreshToken(jti: string): void {
  refreshTokenHashByJti.delete(jti);
  // macht Refresh Token ungültig (Logout/Rotation)
}
