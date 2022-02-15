/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-namespace */
export interface PermissionMeta {
  name: string;
  authority?: string;
  children?: PermissionMeta[];
  description?: string;
  permissions?: AuthorityType[];
}

export interface AuthorityType {
  authority?: string;
  checked?: boolean;
  disabled?: boolean;
  description?: string;
}
