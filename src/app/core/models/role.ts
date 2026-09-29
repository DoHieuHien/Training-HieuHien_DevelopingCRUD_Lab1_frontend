export const ROLE = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  OPERATION: 'OPERATION',
  USER: 'USER',
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];

export const ALL_ROLES: Role[] = ['ADMIN', 'MANAGER', 'OPERATION', 'USER'];
export const IMPORT_ROLES: Role[] = ['ADMIN', 'MANAGER'];
export const EXPORT_ROLE: Role[] = ['ADMIN', 'MANAGER', 'OPERATION'];
