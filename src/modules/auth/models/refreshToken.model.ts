// refreshToke.model.ts
import { Schema, model, Types } from "mongoose";

export interface RefreshTokenDocument {
    userId: Types.ObjectId;
    jti: string;
    tokenHash: string;
    expiresAt: Date;
}

const refreshTokenSchema = new Schema<RefreshTokenDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        jti: {
            type: String,
            required: true,
            unique: true,
        },

        tokenHash: {
            type: String,
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel = model<RefreshTokenDocument>("RefreshToken", refreshTokenSchema);