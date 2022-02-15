import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoErrorTipModule } from '@components/auto-error-tip/auto-error-tip.module';

import { NotificationSubscriptionAddComponent } from './notification-subscription-add.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzRadioModule,
    NzSelectModule,
    AutoErrorTipModule,
    NzButtonModule,
    NzGridModule,
    NzDrawerModule,
    NzDividerModule,
    NzModalModule,
    NzIconModule
  ],
  declarations: [NotificationSubscriptionAddComponent]
})
export class NotificationSubscriptionAddModule { }
