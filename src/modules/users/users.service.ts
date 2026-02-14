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

const userByemail = new Map<string, User>();

export async function createUser(input: {
    email: string;
    password: string;
    orgId: string;
}): Promise<User> {
    const passwordHash = await bcrypt.hash(input.password, 12);

    const user: User = {
        id: crypto.randomUUID(),
        email: input.email.toLowerCase(),
        passwordHash,
        orgId: input.orgId,
        role: "owner",
    };

    userByemail.set(user.email, user);

    return user;
}

export function getuserByEmail(email: string): User | undefined {
    return userByemail.get(email.toLowerCase());
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
}