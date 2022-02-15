import { CaptchaModule } from 'src/app/components/captcha';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AutoErrorTipModule } from '@components/auto-error-tip/auto-error-tip.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzResultModule } from 'ng-zorro-antd/result';

import { NewPasswordComponent } from './new-password.component';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzProgressModule } from 'ng-zorro-antd/progress';

const routes: Routes = [
  {
    path: '',
    component: NewPasswordComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CaptchaModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    AutoErrorTipModule,
    NzSpinModule,
    NzPopoverModule,
    NzIconModule,
    NzResultModule,
    RouterModule.forChild(routes),
    NzStepsModule,
    NzProgressModule,
  ],
  declarations: [NewPasswordComponent],
})
export class NewPasswordModule { }
