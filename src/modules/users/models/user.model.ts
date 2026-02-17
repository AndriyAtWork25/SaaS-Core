// user.model.ts
import  { Schema, model, Types } from "mongoose";

export interface UserDocument {
    email: string;
    passwordHash: string;
    orgId: Types.ObjectId;
    role: "owner" | "admin" | "member" | "viewer";
}

const userSchema = new Schema<UserDocument>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        passwordHash: {
            type: String,
            required: true,
        },

        orgId: {
            type: Schema.Types.ObjectId,
            ref: "Org",
            required: true,
        },

        role: {
            type: String,
            required: true,
            default: "owner",
        },
    },
    {
        timestamps: true,
    }
);

export const UserModel = model<UserDocument>("User", userSchema);
