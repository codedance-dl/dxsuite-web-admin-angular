import { Injectable } from '@angular/core';
import { PermissionGuard } from '@app/store';

import { AuthorityType } from '../permissions';

@Injectable({ providedIn: 'root' })
export class ReceiveConfigPermissionGuard extends PermissionGuard<AuthorityType> {
  static ROLE_KEY: AuthorityType[] = [{
    authority: 'receive-config',
    description: '通知接收管理'
  }];
}
