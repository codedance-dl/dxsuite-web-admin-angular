import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';

import { DemoComponent } from './demo.component';
import { DemoState } from './state/demo.state';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: DemoComponent },
    ]),
    NgxsModule.forFeature([DemoState]),
    NzSpaceModule,
    NzInputModule,
    NzDatePickerModule,
    FormsModule,
    NzSpinModule,
    NzTableModule,
    NzTagModule,
    NzTypographyModule,
    NzPaginationModule,
    CommonModule,
    NzSkeletonModule,
    NzIconModule,
    NzButtonModule,
    NzGridModule,
    NzToolTipModule,
    NzDropDownModule
  ],
  declarations: [DemoComponent],
  exports: [DemoComponent]
})
export class DemoModule { }
