import { User } from '@api/models';

export interface RouteGuardPayload {
  fromUrl?: string;
  toUrl?: string;
}

export class VerifyToken {
  static readonly type = '[用户验证] 校验令牌是否有效';
}

export class SetIdentity {
  static readonly type = '[用户验证] 设置用户身份';
  constructor(public user: User) { }
}

export class UpdateUser {
  static readonly type = '[用户验证] 更新用户信息';
  constructor(public payload: Partial<User>) { }
}

export class ClearIdentity {
  static readonly type = '[用户验证] 清理用户身份';
}

export class AuthorizedRouteAccess {
  static readonly type = '[用户验证] 授权用户访问路由';
  constructor(public fromUrl?: string) { }
}

export class RejectedRouteAccess {
  static readonly type = '[用户验证] 拒绝用户访问路由';
  constructor(public fromUrl?: string, public isUnauthorized?: boolean) { }
}
