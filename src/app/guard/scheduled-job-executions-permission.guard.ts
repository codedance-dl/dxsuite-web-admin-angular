import { Injectable } from '@angular/core';
import { PermissionGuard } from '@app/store';

import { AuthorityType } from '../permissions';

@Injectable({ providedIn: 'root' })
export class ScheduledJobExecutionsPermissionGuard extends PermissionGuard<AuthorityType> {
  static ROLE_KEY: AuthorityType[] = [{
    authority: 'scheduled-job-executions',
    description: '执行记录'
  }];
}

