// orgs.service.ts
import crypto from "node:crypto";

export type Organization = {
    id: string;
    name: string;
};

const orgById = new Map<string, Organization>();

export async function createOrganization(name: string): Promise<Organization> {
   const org: Organization = {
        id: crypto.randomUUID(),
        name,
    };

    orgById.set(org.id, org);
    return org;
}