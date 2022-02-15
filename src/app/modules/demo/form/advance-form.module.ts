import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzUploadModule } from 'ng-zorro-antd/upload';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AutoErrorTipModule } from '@components/auto-error-tip/auto-error-tip.module';

import { CanDeactivateGuard } from '../../../guard';
import { AdvanceFormComponent } from './advance-form.component';

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
      { path: '', canDeactivate: [CanDeactivateGuard], component: AdvanceFormComponent },
    ]),
  ],
  declarations: [AdvanceFormComponent],
  providers: [CanDeactivateGuard]
})

export class AdvanceFormModule { }