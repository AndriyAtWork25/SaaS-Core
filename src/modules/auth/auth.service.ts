// auth.service.ts
import { AppError } from "../../shared/errors/AppError"; // 4xx errors
import { createOrganization } from "../orgs/orgs.service"; // org create (DB)
import { createUser, getUserByEmail, getUserById, verifyPassword } from "../users/users.service"; // user ops (DB)
import {
  issueAccessToken,
  issueRefreshToken,
  verifyRefreshToken,
  isRefreshTokenActive,
  revokeRefreshToken,
} from "./token.service"; // token ops (DB)

export async function registerService(input: { email: string; password: string; orgName: string }) {
  const organization = await createOrganization(input.orgName);

  const user = await createUser({
    email: input.email,
    password: input.password,
    orgId: organization.id,
  });

  const accessToken = issueAccessToken({ sub: user.id, orgId: user.orgId, role: user.role });

  const { refreshToken } = await issueRefreshToken(user.id);

  return {
    user: { id: user.id, email: user.email, role: user.role },
    organization,
    tokens: { accessToken, refreshToken },
  };
}

export async function loginService(input: { email: string; password: string }) {
  const user = await getUserByEmail(input.email);

  if (!user) throw new AppError("Invalid credentials", 401);

  const ok = await verifyPassword(user, input.password);
  if (!ok) throw new AppError("Invalid credentials", 401);

  const accessToken = issueAccessToken({ sub: user.id, orgId: user.orgId, role: user.role });
  const { refreshToken } = await issueRefreshToken(user.id);

  return { accessToken, refreshToken };
}

export async function refreshService(input: { refreshToken: string }) {
  const payload = verifyRefreshToken(input.refreshToken);

  const active = await isRefreshTokenActive(payload.jti, input.refreshToken);
  if (!active) throw new AppError("Refresh token revoked", 401);

  // Rotation: alten Token löschen
  await revokeRefreshToken(payload.jti);

  // Jetzt können wir orgId/role korrekt aus DB laden
  const user = await getUserById(payload.sub);
  if (!user) throw new AppError("User not found", 401);

  const accessToken = issueAccessToken({ sub: user.id, orgId: user.orgId, role: user.role });
  const { refreshToken } = await issueRefreshToken(user.id);

  return { accessToken, refreshToken };
}
