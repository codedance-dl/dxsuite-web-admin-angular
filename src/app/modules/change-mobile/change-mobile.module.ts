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
import { ChangeMobileComponent } from './change-mobile.component';
import { ChangeMobileFinishedComponent } from './finished/finish.component';
import { ChangeMobileUpdateComponent } from './update/update.component';
import { ChangeMobileVerifyComponent } from './verify/verify.component';

@NgModule({
  imports: [
    CommonModule,
    CaptchaModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChangeMobileComponent,
        resolve: {
          credentials: SecurityResolve
        }
      }
    ]),
    NzStepsModule,
    NzFormModule,
    AutoErrorTipModule,
    NzInputModule,
    NzButtonModule,
    NzResultModule,
    ReactiveFormsModule,
    NzIconModule
  ],
  entryComponents: [
    ChangeMobileComponent,
    ChangeMobileVerifyComponent,
    ChangeMobileUpdateComponent,
    ChangeMobileFinishedComponent
  ],
  declarations: [
    ChangeMobileComponent,
    ChangeMobileVerifyComponent,
    ChangeMobileUpdateComponent,
    ChangeMobileFinishedComponent
  ],
  providers: [SecurityResolve]
})
export class ChangeMobileModule { }
