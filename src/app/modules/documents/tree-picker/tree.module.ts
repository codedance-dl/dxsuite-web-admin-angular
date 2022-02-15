import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TreePickerComponent } from './tree.component';
import { CdkTreeModule } from '@angular/cdk/tree';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';

@NgModule({
  imports: [
    CommonModule,
    CdkTreeModule,
    NzToolTipModule,
    NzButtonModule,
    NzIconModule,
    NzGridModule

  ],
  declarations: [TreePickerComponent],
  entryComponents: [TreePickerComponent],
  exports: [TreePickerComponent]
})
export class TreePickerModule { }
