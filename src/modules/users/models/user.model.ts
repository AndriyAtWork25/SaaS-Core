// user.model.ts
// user.model.ts
import { Schema, model, Types, Document } from "mongoose";

// Document = bringt _id automatisch mit
export interface UserDocument extends Document {
  email: string;
  passwordHash: string;
  orgId: Types.ObjectId;
  role: "owner" | "admin" | "member" | "viewer";

  createdAt: Date;   // ✅ von timestamps
  updatedAt: Date;   // ✅ von timestamps
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
