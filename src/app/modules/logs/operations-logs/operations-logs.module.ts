import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { SecurityModule } from '@store/security';

import { OperationsLogsState } from '../state/operations-logs.state';
import { OperationsLogsComponent } from './operations-logs.component';

@NgModule({
  imports: [
    NgxsModule.forFeature([OperationsLogsState]),
    RouterModule.forChild([
      { path: '', component: OperationsLogsComponent },
      {
        path: ':auditId',
        data: { title: '日志详情' },
        loadChildren: () => import('./operations-logs-details.module').then(mod => mod.OperationsLogsDetailsModule)
      }
    ]),
    CommonModule,
    SecurityModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzPaginationModule,
    NzDividerModule,
    NzLayoutModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzSpaceModule,
    NzTagModule,
    NzTypographyModule,
    NzSkeletonModule,
    NzSpinModule,
    NzDatePickerModule,
    NzToolTipModule,
    NzDropDownModule
  ],
  declarations: [OperationsLogsComponent]
})
export class OperationsLogsModule { }
