import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AutoErrorTipModule } from '@components/auto-error-tip/auto-error-tip.module';
import { CaptchaModule } from '@components/captcha';

import { InviteComponent } from './invite.component';
import { InviteService } from './invite.service';
import { NzProgressModule } from 'ng-zorro-antd/progress';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AutoErrorTipModule,
    NzPopoverModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzCheckboxModule,
    CaptchaModule,
    RouterModule.forChild([
      {
        path: '',
        component: InviteComponent
      }
    ]),
    NzProgressModule
  ],
  declarations: [InviteComponent],
  providers: [InviteService]
})
export class InviteModule { }
