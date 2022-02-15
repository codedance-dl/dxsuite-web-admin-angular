/* eslint-disable @typescript-eslint/no-namespace */
import { RequestQueryParams, RolesBody } from '@api/models';

import { RolesModel } from './data/roles.model';

export namespace RolesActions {

  export class GetAll {
    static readonly type = '[角色管理] 查询全部角色信息';
    constructor(public queryParams?: RequestQueryParams) { }
  }

  export class GetOne {
    static readonly type = '[角色管理] 获取角色权限';
    constructor(public roleId: string) { }
  }

  export class AddOne {
    static readonly type = '[角色管理] 创建角色';
    constructor(public data: RolesBody) { }
  }

  export class RemoveOne {
    static readonly type = '[角色管理] 删除角色';
    constructor(
      public roleId: string,
      public revision?: number
    ) { }
  }

  export class UpdateOne {
    static readonly type = '[角色管理] 编辑角色';
    constructor(
      public roleId: string,
      public data: Partial<RolesModel>,
      public revision?: number
    ) { }
  }

  export class AssignPrivileges {
    static readonly type = '[角色管理] 分配角色权限';
    constructor(public roleId: string, public authorities: string[], public revision: number) { }
  }

  export class UpdateDisplayedColumns {
    static readonly type = '[角色管理] 列表可见字段更新';
    constructor(public displayedColumns: string[]) { }
  }
}
