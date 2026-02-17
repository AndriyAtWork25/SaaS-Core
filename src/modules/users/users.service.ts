// users.service.ts
import bcrypt from "bcrypt"; // hashing + compare
import { UserModel } from "./models/user.model"; // Zugriff auf User Collection

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  orgId: string;
  role: "owner" | "admin" | "member" | "viewer";
};

export async function createUser(input: {
  email: string;
  password: string;
  orgId: string; // kommt als string rein
}): Promise<User> {
  const passwordHash = await bcrypt.hash(input.password, 12);
  // Hashing im Service (Business Layer), nicht im Controller

  const user = await UserModel.create({
    email: input.email.toLowerCase(), // normalisieren
    passwordHash, // nur Hash speichern
    orgId: input.orgId, // Mongoose castet string -> ObjectId
    role: "owner",
  });

  return {
    id: user._id.toString(),
    email: user.email,
    passwordHash: user.passwordHash,
    orgId: user.orgId.toString(),
    role: user.role,
  };
}

export async function getUserById(id: string): Promise<User | undefined> {
  const user = await UserModel.findById(id).exec();
  if (!user) return undefined;

  return {
    id: user._id.toString(),
    email: user.email,
    passwordHash: user.passwordHash,
    orgId: user.orgId.toString(),
    role: user.role,
  };
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const user = await UserModel.findOne({ email: email.toLowerCase() }).exec();
  if (!user) return undefined;

  return {
    id: user._id.toString(),
    email: user.email,
    passwordHash: user.passwordHash,
    orgId: user.orgId.toString(),
    role: user.role,
  };
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  // compare: Klartext vs Hash -> true/false
  return bcrypt.compare(password, user.passwordHash);
}
