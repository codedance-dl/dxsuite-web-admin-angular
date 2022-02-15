import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { AutoErrorTipModule } from '@components/auto-error-tip/auto-error-tip.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './profile.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';

@NgModule({
  imports: [
    CommonModule,
    NzFormModule,
    NzButtonModule,
    NzDatePickerModule,
    NzRadioModule,
    NzInputModule,
    NzIconModule,
    NzUploadModule,
    NzSpinModule,
    AutoErrorTipModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserProfileComponent
      }
    ])
  ],
  declarations: [UserProfileComponent]
})
export class ProfileModule { }
