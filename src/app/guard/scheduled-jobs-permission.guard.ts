import { Injectable } from '@angular/core';
import { PermissionGuard } from '@app/store';

import { AuthorityType } from '../permissions';

@Injectable({ providedIn: 'root' })
export class ScheduledJobsPermissionGuard extends PermissionGuard<AuthorityType> {
  static ROLE_KEY: AuthorityType[] = [{
    authority: 'scheduled-job',
    description: '定时任务'
  }];
}

