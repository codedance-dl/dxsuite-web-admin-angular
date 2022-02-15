import { Injectable } from '@angular/core';
import { PermissionGuard } from '@store/security';
import { AuthorityType } from '../permissions';

@Injectable({ providedIn: 'root' })
export class NotificationTemplatePermissionGuard extends PermissionGuard<AuthorityType> {
  static ROLE_KEY: AuthorityType[] = [{
    authority: 'notification-template',
    description: '通知模版'
  }];
}
