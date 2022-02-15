import { NzButtonModule } from 'ng-zorro-antd/button';
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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SecurityModule } from '@app/store';
import { NgxsModule } from '@ngxs/store';

import { ScheduledJobExecutionsComponent } from './scheduled-jobs-executions.component';
import { ScheduledJobExecutionsState } from './scheduled-jobs-executions.state';
import { ScheduledJobsExecutionsSkeletonComponent } from './scheduled-jobs-executions.skeleton';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@NgModule({
  imports: [
    NgxsModule.forFeature([ScheduledJobExecutionsState]),
    RouterModule.forChild([
      {
        path: '',
        component: ScheduledJobExecutionsComponent
      }
    ]),
    CommonModule,
    SecurityModule,
    FormsModule,
    NzGridModule,
    NzTableModule,
    NzFormModule,
    ReactiveFormsModule,
    NzDividerModule,
    NzPaginationModule,
    NzLayoutModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzSpaceModule,
    ReactiveFormsModule,
    NzSkeletonModule,
    NzSelectModule,
    NzToolTipModule,
    NzDropDownModule
  ],
  declarations: [ScheduledJobExecutionsComponent,ScheduledJobsExecutionsSkeletonComponent],
})
export class ScheduledJobsExecutionsModule { }
