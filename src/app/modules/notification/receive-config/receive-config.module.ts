import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NotificationSubscriptionState
} from '@app/modules/notification-subscription/notification-subscription.state';
import { NgxsModule } from '@ngxs/store';

import { ReceiveConfigComponent } from './receive-config.component';
import { SetReceiverModule } from './set-receiver/set-receiver.module';

@NgModule({
  imports: [
    NgxsModule.forFeature([NotificationSubscriptionState]),
    RouterModule.forChild([
      {
        path: '',
        component: ReceiveConfigComponent
      }
    ]),
    CommonModule,
    FormsModule,
    NzListModule,
    NzGridModule,
    NzSwitchModule,
    NzSelectModule,
    SetReceiverModule
  ],
  declarations: [ReceiveConfigComponent]
})
export class ReceiveConfigModule { }
