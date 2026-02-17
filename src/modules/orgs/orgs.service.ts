// orgs.service.ts
import { OrgModel } from "./models/org.model";

export type Organization = {
    id: string;
    name: string;
};


export async function createOrganization(name: string): Promise<Organization> {
   const org = await OrgModel.create({
     name,
     });
        
    return {
        id: org._id.toString(),
        name: org.name,
    };
}