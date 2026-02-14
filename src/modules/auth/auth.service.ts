// auth.service.ts
import { AppError } from "../../shared/errors/AppError"; // 4xx Errors
import { createOrganization } from "../orgs/orgs.service"; // Org erstellen
import { createUser, getuserByEmail, verifyPassword } from "../users/users.service"; // User ops
import {
  issueAccessToken,
  issueRefreshToken,
  verifyRefreshToken,
  isRefreshTokenActive,
  revokeRefreshToken,
} from "./token.service"; // Token ops

export async function registerService(input: {
  email: string;
  password: string;
  orgName: string;
}) {
  const organization = await createOrganization(input.orgName);
  // Erst Org (Tenant) erstellen

  const user = await createUser({
    email: input.email,
    password: input.password,
    orgId: organization.id,
  });
  // Dann User erstellen + password hashing passiert im users.service

  const accessToken = issueAccessToken({ sub: user.id, orgId: user.orgId, role: user.role });
  // Kurzlebiger Access Token

  const { refreshToken } = issueRefreshToken(user.id);
  // Langlebiger Refresh Token

  return {
    user: { id: user.id, email: user.email, role: user.role },
    organization,
    tokens: { accessToken, refreshToken },
  };
}

export async function loginService(input: { email: string; password: string }) {
  const user = getuserByEmail(input.email);
  // User finden (in-memory)

  if (!user) throw new AppError("Invalid credentials", 401);
  // gleiche Message für Email/Passwort (kein User-Enum)

  const ok = await verifyPassword(user, input.password);
  if (!ok) throw new AppError("Invalid credentials", 401);

  const accessToken = issueAccessToken({ sub: user.id, orgId: user.orgId, role: user.role });
  const { refreshToken } = issueRefreshToken(user.id);

  return { accessToken, refreshToken };
}

export async function refreshService(input: { refreshToken: string }) {
  const payload = verifyRefreshToken(input.refreshToken);
  // Signature + expiry check

  if (!isRefreshTokenActive(payload.jti, input.refreshToken)) {
    throw new AppError("Refresh token revoked", 401);
  }

  // Rotation: alten Refresh Token killen
  revokeRefreshToken(payload.jti);

  // Ohne DB kennen wir orgId/role nicht zuverlässig beim Refresh.
  // Das fixen wir, sobald MongoDB drin ist.
  const accessToken = issueAccessToken({ sub: payload.sub, orgId: "unknown", role: "unknown" });

  const { refreshToken } = issueRefreshToken(payload.sub);
  return { accessToken, refreshToken };
}
