import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicSettingComponent } from './basic-setting.component';
import { RouterModule } from '@angular/router';
import { SetExpirationTimeModalModule } from './set-expiration-time-modal/set-expiration-time-modal.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@NgModule({
  imports: [
    CommonModule,
    SetExpirationTimeModalModule,
    ReactiveFormsModule,
    NzSwitchModule,
    NzModalModule,
    FormsModule,
    NzSpinModule,
    RouterModule.forChild([
      {
        path: '',
        component: BasicSettingComponent
      }
    ])
  ],
  declarations: [BasicSettingComponent]
})
export class BasicSettingModule { }
