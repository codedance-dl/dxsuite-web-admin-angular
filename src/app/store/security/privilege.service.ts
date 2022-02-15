/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable } from '@angular/core';
import { AuthState } from '../auth';
import { GuardHandler } from '@app/store';
import { Store } from '@ngxs/store';
import { AuthorityType } from '@app/permissions';


@Injectable()
export class PrivilegeService implements GuardHandler<AuthorityType> {

  constructor(private store: Store) { }

  /**
   * 请求权限数据
   */
  getPrivilege(): Array<any> {
    return this.store.selectSnapshot(AuthState.getPrivilege);
  }

  /**
   * 判断是否有权限
   */
  hasPrivilege(targets?: AuthorityType[]): boolean {
    const permissions = this.getPrivilege() || [];
    if (permissions.find(permission => permission.indexOf('.') === -1)) {
      return true;
    } else if (permissions.find(permission => permission === 'all')) {
      return true;
    } else if (targets.length === 0) {
      return true;
    } else if (permissions.length === 0) {
      return false;
    } else {
      let hasPermission = true;
      for (const target of targets) {
        hasPermission = !!permissions.find(permission =>
          // 获取用户权限，并通过权重获取最高权限
          permission.indexOf(target.authority) > -1
        );
        if (!hasPermission) {
          return;
        }
      }
      return hasPermission;
    }
  }

}
