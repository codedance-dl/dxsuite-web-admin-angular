import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';

import {
  NotificationSubscriptionAddModule
} from './notification-subscription-add/notification-subscription-add.module';
import { NotificationSubscriptionComponent } from './notification-subscription.component';
import { NotificationSubscriptionState } from './notification-subscription.state';
import { subRoute } from './routes';

@NgModule({
  imports: [
    NgxsModule.forFeature([NotificationSubscriptionState]),
    RouterModule.forChild([
      {
        path: '',
        component: NotificationSubscriptionComponent,
        children: subRoute
      }
    ]),
    CommonModule,
    NzTabsModule,
    NzButtonModule,
    NzIconModule,
    NzDrawerModule,
    NotificationSubscriptionAddModule
  ],
  declarations: [NotificationSubscriptionComponent]
})
export class NotificationSubscriptionModule { }
