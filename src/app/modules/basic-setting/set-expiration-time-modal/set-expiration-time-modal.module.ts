import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetExpirationTimeModalComponent } from './set-expiration-time-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { AutoErrorTipModule } from '@components/auto-error-tip/auto-error-tip.module';

@NgModule({
  imports: [
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSpaceModule,
    AutoErrorTipModule,
    ReactiveFormsModule,
  ],
  declarations: [SetExpirationTimeModalComponent],
  exports: [SetExpirationTimeModalComponent],
  entryComponents: [SetExpirationTimeModalComponent]
})
export class SetExpirationTimeModalModule { }
