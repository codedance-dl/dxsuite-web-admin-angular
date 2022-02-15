import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzStepsModule } from 'ng-zorro-antd/steps';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AutoErrorTipModule } from '@components/auto-error-tip/auto-error-tip.module';
import { CaptchaModule } from '@components/captcha';

import { SecurityResolve } from '../user-setting/security/security.resolve';
import { ChangeEmailComponent } from './change-email.component';
import { ChangeEmailFinishedComponent } from './finished/finish.component';
import { ChangeEmailUpdateComponent } from './update/update.component';
import { ChangeEmailVerifyComponent } from './verify/verify.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CaptchaModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChangeEmailComponent,
        resolve: {
          credentials: SecurityResolve
        }
      }
    ]),
    NzFormModule,
    AutoErrorTipModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzStepsModule,
    NzResultModule
  ],
  entryComponents: [
    ChangeEmailComponent,
    ChangeEmailVerifyComponent,
    ChangeEmailUpdateComponent,
    ChangeEmailFinishedComponent
  ],
  declarations: [
    ChangeEmailComponent,
    ChangeEmailVerifyComponent,
    ChangeEmailUpdateComponent,
    ChangeEmailFinishedComponent
  ],
  providers: [SecurityResolve]
})
export class ChangeEmailModule { }
