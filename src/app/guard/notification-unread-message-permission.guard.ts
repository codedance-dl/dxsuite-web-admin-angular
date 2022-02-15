import { Injectable } from '@angular/core';
import { PermissionGuard } from '@app/store';

import { AuthorityType } from '../permissions';

@Injectable({ providedIn: 'root' })
export class NotificationUnreadMessagePermissionGuard extends PermissionGuard<AuthorityType> {
  static ROLE_KEY: AuthorityType[] = [{
    authority: 'notification-unread-message',
    description: '未读消息'
  }];
}

