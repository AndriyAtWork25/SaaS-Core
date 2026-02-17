//org.models.ts
import { Schema, model } from "mongoose"; 

export interface OrgDocument {
    name: string;
}

const orgSchema = new Schema<OrgDocument>(
    { 
        name: {
            type: String,
            required: true,
            minlength: 2,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export const OrgModel = model<OrgDocument>("Org", orgSchema);
   