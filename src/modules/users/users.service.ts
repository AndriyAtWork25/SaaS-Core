// users.service.ts
import bcrypt from "bcrypt";
import crypto from "node:crypto";

export type User = {
    id: string;
    email: string;
    passwordHash: string;
    orgId: string;
    role: "owner";
};

export async function createUser(input: {
    email: string;
    password: string;
    orgId: string;
}): Promise<User> {
    const passwordHash = await bcrypt.hash(input.password, 12);

    return {
        id: crypto.randomUUID(),
        email: input.email,
        passwordHash,
        orgId: input.orgId,
        role: "owner",
    };
}