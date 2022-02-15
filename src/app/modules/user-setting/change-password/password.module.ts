import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NzElementPatchModule } from 'ng-zorro-antd/core/element-patch';
import { UserPasswordComponent } from './password.component';
import { AutoErrorTipModule } from '@components/auto-error-tip/auto-error-tip.module';
import { NzProgressModule } from 'ng-zorro-antd/progress';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzPopoverModule,
    NzInputModule,
    NzFormModule,
    NzIconModule,
    AutoErrorTipModule,
    NzElementPatchModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserPasswordComponent
      }
    ]),
    NzProgressModule
  ],
  declarations: [UserPasswordComponent]
})
export class PasswordModule { }
