import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CaptchaModule } from '@components/captcha';

import { SecurityComponent } from './security.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CaptchaModule,
    RouterModule.forChild([
      {
        path: '',
        component: SecurityComponent,

      }
    ])
  ],
  declarations: [
    SecurityComponent
  ],
})
export class SecurityModule { }
