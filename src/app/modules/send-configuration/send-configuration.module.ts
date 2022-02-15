import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendConfigurationComponent } from './send-configuration.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { AutoErrorTipModule } from '@components/auto-error-tip/auto-error-tip.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzFormModule,
    NzSpinModule,
    AutoErrorTipModule,
    RouterModule.forChild([
      {
        path: '',
        component: SendConfigurationComponent
      }
    ])
  ],
  declarations: [SendConfigurationComponent]
})
export class SendConfigurationModule { }
