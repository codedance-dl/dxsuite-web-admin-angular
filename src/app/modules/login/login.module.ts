import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AutoErrorTipModule } from '@components/auto-error-tip/auto-error-tip.module';

import { LoginComponent } from './login.component';
import { CaptchaComponent, CaptchaModule } from '@components/captcha';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: LoginComponent }
    ]),
    CommonModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    CaptchaModule,
    AutoErrorTipModule,
    NzTabsModule
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent],
  entryComponents: [CaptchaComponent]
})
export class LoginModule { }
