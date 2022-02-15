export interface RolesModel {
  id?: string;
  name?: string;
  currentRole?: string;
  memberIDs?: string[];
  authorities?: string[];
  description?: string;
  revision: number;
}
