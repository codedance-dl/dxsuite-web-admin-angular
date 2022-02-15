import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SecurityModule } from '@app/store';
import { NgxsModule } from '@ngxs/store';

import { ScheduledJobsComponent } from './scheduled-jobs.component';
import { ScheduledJobsState } from './scheduled-jobs.state';
import { ScheduledJobsSkeletonComponent } from './scheduled-jobs.skeleton';
import { ScheduledAddComponent } from './add/add.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { AutoErrorTipModule } from '@components/auto-error-tip/auto-error-tip.module';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
@NgModule({
  imports: [
    NgxsModule.forFeature([ScheduledJobsState]),
    RouterModule.forChild([
      {
        path: '',
        component: ScheduledJobsComponent
      }
    ]),
    CommonModule,
    SecurityModule,
    FormsModule,
    NzGridModule,
    NzTableModule,
    NzFormModule,
    ReactiveFormsModule,
    NzTagModule,
    NzCardModule,
    NzDividerModule,
    NzPaginationModule,
    NzLayoutModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzSpaceModule,
    NzSkeletonModule,
    NzModalModule,
    NzSelectModule,
    NzDatePickerModule,
    AutoErrorTipModule,
    NzDropDownModule,
    NzToolTipModule
  ],
  declarations: [ScheduledJobsComponent,ScheduledJobsSkeletonComponent,ScheduledAddComponent],
})
export class ScheduledJobsModule { }
