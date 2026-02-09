// auth.service.ts
import { createOrganization } from "../orgs/orgs.service"; 
import { createUser } from "../users/users.service"; 

export async function registerService(input: {
  email: string;
  password: string;
  orgName: string;
}) {
  const organization = await createOrganization(input.orgName);
  
  const user = await createUser({
    email: input.email,
    password: input.password, 
    orgId: organization.id,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    organization,
  };
}
