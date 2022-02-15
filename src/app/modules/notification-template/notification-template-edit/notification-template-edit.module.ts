import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NotificationTemplateResolve } from '../notification-template-resolve';
import { NotificationTemplateEditComponent } from './notification-template-edit.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AutoErrorTipModule } from '@components/auto-error-tip/auto-error-tip.module';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@NgModule({
  imports: [
    CommonModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    AutoErrorTipModule,
    NzAlertModule,
    RouterModule.forChild([{
      path: '',
      resolve: { template: NotificationTemplateResolve },
      component: NotificationTemplateEditComponent
    }])
  ],
  declarations: [NotificationTemplateEditComponent],
  providers: [NotificationTemplateResolve]
})
export class NotificationTemplateEditModule { }
