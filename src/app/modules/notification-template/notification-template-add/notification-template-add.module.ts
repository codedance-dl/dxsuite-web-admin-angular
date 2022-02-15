import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NotificationTemplateAddComponent } from './notification-template-add.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { AutoErrorTipModule } from '@components/auto-error-tip/auto-error-tip.module';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@NgModule({
  imports: [
    CommonModule,
    NzRadioModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzSpaceModule,
    NzAlertModule,
    AutoErrorTipModule,
    RouterModule.forChild([
      {
        path: '',
        component: NotificationTemplateAddComponent
      }
    ])
  ],
  declarations: [NotificationTemplateAddComponent]
})
export class NotificationTemplateAddModule { }
