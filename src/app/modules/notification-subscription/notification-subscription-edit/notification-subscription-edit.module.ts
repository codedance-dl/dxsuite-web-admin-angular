import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoErrorTipModule } from '@components/auto-error-tip/auto-error-tip.module';

import { NotificationSubscriptionEditComponent } from './notification-subscription-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzRadioModule,
    NzSelectModule,
    AutoErrorTipModule,
    NzButtonModule,
    NzGridModule,
    NzDrawerModule,
    NzIconModule
  ],
  declarations: [NotificationSubscriptionEditComponent]
})
export class NotificationSubscriptionEditModule { }
