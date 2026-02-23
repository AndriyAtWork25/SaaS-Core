// invite.model.ts
import {Schema, model, Types} from "mongoose";

export interface InviteDocument {
    orgId: Types.ObjectId;
    email: string;
    role: "admin" | "member" | "viewer";
    tokenHash: string;
    expiresAt: Date;
    acceptedAt?: Date;
}

const inviteSchema = new Schema<InviteDocument>(
    {
        orgId: {
            type: Schema.Types.ObjectId,
            ref: "Org",
            required: true,
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        role: {
            type: String,
            required: true,
          },

        tokenHash: {
            type: String,
            required: true,
            unique: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        acceptedAt: {
            type: Date,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

// Set TTL index to automatically delete expired invites
inviteSchema.index({ expiresAt: 1}, { expireAfterSeconds: 0 });

export const InviteModel = model<InviteDocument>("Invite", inviteSchema);
