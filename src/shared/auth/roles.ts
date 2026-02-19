//roles.ts
export const ROLES = ["owner", "admin", "member", "viewer" ] as const;

export type Role = typeof ROLES[number];

export const ROLE_RANK: Record<Role, number> = {
    owner: 4, // Höchste Rolle
    admin: 3, // Zweithöchste Rolle
    member: 2, // Standardrolle für normale Mitglieder
    viewer: 1, // Niedrigste Rolle, nur Leserechte
};