import { Role } from '@api/models';
import { AuthorityType } from '@app/permissions';

import { CreatedBy, DisabledBy, LastModifiedBy } from './';

export interface User {
  id: string;
  name: string;
  type: UserType;
  avatar?: string;
  birthDate?: Date | null;
  gender?: Gender;
  familyName?: string;
  fullName?: string;
  givenName?: string;
  nameAlphabets?: string;
  revision?: number;
  createdAt: Date;
  createdBy?: CreatedBy;
  lastModifiedAt?: Date;
  lastModifiedBy?: LastModifiedBy;
  disabled?: boolean;
  disabledAt?: Date;
  disabledBy?: DisabledBy;
  privileges?: AuthorityType[];
  authorities?: string[];
  roles: Role[];
  passwordStatus: {
    expired: boolean; // 是否已过期
    initial: boolean; // 是否需要初始化
  };
  rootDirectory?: string;
  supplierName?: string;
  nickName?: string; //微信昵称
  description?: string;
}

export interface UserCreate {
  name?: string;
  avatar?: string;
  birthDate?: Date | null;
  credential?: string;
  email?: string;
  emailVerificationCode?: string;
  familyName?: string;
  fullName?: string;
  givenName?: string;
  gender?: Gender;
  mobile?: string;
  nameAlphabets?: string;
  nameConverter?: NameConverter;
  password?: string;
  smsVerificationCode?: string;
  username?: string;
  disabled?: boolean;
}

export interface UserUpdate {
  name: string;
  gender?: string | null;
  birthDate?: Date | null;
  avatar?: string | null;
  nickName?: string | null;
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  UNKNOWN = 'unknown',
}

export enum UserType {
  ANONYMOUS = 'ANONYMOUS',
  SYSTEM = 'SYSTEM',
  USER = 'USER',
  ADMINISTRATOR = 'ADMINISTRATOR',
  SUPER = 'SUPER',
}

export enum NameConverter {
  NONE = 'NONE',
  CHINESE = 'CHINESE',
  JAPANESE = 'JAPANESE',
  KOREAN = 'KOREAN'
}
