import { CaptchaComponent, CaptchaModule } from 'src/app/components/captcha';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AutoErrorTipModule } from '@components/auto-error-tip/auto-error-tip.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzResultModule } from 'ng-zorro-antd/result';

import { ResetPasswordComponent } from './reset-password.component';
import { ResetVerifyComponent } from './verify/verify.component';
import { ResetUpdateComponent } from './update/update.component';
import { ResetFinishComponent } from './finish/finish.component';
import { NzProgressModule } from 'ng-zorro-antd/progress';


const routes: Routes = [
  {
    path: '', component: ResetPasswordComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    CaptchaModule,
    NzStepsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    AutoErrorTipModule,
    NzSpinModule,
    NzPopoverModule,
    NzIconModule,
    NzResultModule,
    NzProgressModule
  ],
  entryComponents: [
    CaptchaComponent,
    ResetVerifyComponent,
    ResetUpdateComponent,
    ResetFinishComponent
  ],
  declarations: [
    ResetPasswordComponent,
    ResetVerifyComponent,
    ResetUpdateComponent,
    ResetFinishComponent
  ]
})
export class ResetPasswordModule { }
