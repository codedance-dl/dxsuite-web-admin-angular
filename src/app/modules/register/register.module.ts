import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { CaptchaComponent, CaptchaModule } from 'src/app/components/captcha';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AutoErrorTipModule } from '@components/auto-error-tip/auto-error-tip.module';

import { RegisterComponent } from './register.component';
import { NzElementPatchModule } from 'ng-zorro-antd/core/element-patch';
import { NzProgressModule } from 'ng-zorro-antd/progress';

const routes: Routes = [
  { path: '', component: RegisterComponent, data: { title: '注册' } }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzPopoverModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzCheckboxModule,
    CaptchaModule,
    AutoErrorTipModule,
    NzProgressModule,
    RouterModule.forChild(routes),
    NzElementPatchModule
  ],
  entryComponents: [CaptchaComponent],
  declarations: [RegisterComponent]
})
export class RegisterModule {}
