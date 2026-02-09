// orgs.service.ts
export type Organization = {
    id: string;
    name: string;
};

export async function createOrganization(name: string): Promise<Organization> {
   // TODO: später echte DB

   return {
    id: crypto.randomUUID(),
    name,
   };
}