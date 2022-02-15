import { NzTagModule } from 'ng-zorro-antd/tag';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OperationsLogsDetailsComponent } from './operations-logs-details.component';
import { OperationsLogsResolve } from './operations-logs-resolve';

@NgModule({
  imports: [
    CommonModule,
    NzTagModule,
    RouterModule.forChild([
      {
        path: '',
        resolve: { template: OperationsLogsResolve },
        component: OperationsLogsDetailsComponent
      }
    ])
  ],
  declarations: [OperationsLogsDetailsComponent],
  providers: [OperationsLogsResolve]
})
export class OperationsLogsDetailsModule { }
