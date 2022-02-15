export interface Role {
  id?: string;
  name?: string;
  authorities?: string[];
  tenant?: string;
  description?: string;
  revision?: number;
  createdAt?: Date;
  createdBy?: string;
  lastModifiedAt?: Date;
  lastModifiedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;
  deleted?: boolean;
}

export interface RolesBody {
  name?: string;
  description?: string;
  authorities?: string[];
}