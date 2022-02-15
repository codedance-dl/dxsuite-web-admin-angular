import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SetReceiverComponent } from './set-receiver.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzDropDownModule,
    NzIconModule,
    NzToolTipModule,
    NzEmptyModule
  ],
  declarations: [SetReceiverComponent],
  exports: [SetReceiverComponent]
})
export class SetReceiverModule { }
