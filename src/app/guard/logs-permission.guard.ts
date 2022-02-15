import { Injectable } from '@angular/core';
import { PermissionGuard } from '@app/store';

import { AuthorityType } from '../permissions';

@Injectable({ providedIn: 'root' })
export class LogsPermissionGuard extends PermissionGuard<AuthorityType> {
  static ROLE_KEY: AuthorityType[] = [{
    authority: 'access-log',
    description: '日志管理'
  }];
}
