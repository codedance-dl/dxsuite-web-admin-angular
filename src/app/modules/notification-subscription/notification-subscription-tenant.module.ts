import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
  NotificationSubscriptionEditModule
} from './notification-subscription-edit/notification-subscription-edit.module';
import {
  NotificationSubscriptionTenantComponent
} from './notification-subscription-tenant.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: NotificationSubscriptionTenantComponent
      }
    ]),
    CommonModule,
    NzCollapseModule,
    NzIconModule,
    NzDividerModule,
    NzTableModule,
    NzDrawerModule,
    NzSpinModule,
    NzToolTipModule,
    NzModalModule,
    NotificationSubscriptionEditModule
  ],
  declarations: [NotificationSubscriptionTenantComponent],
})
export class NotificationSubscriptionTenantModule { }
