import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UploadMonitorBodyComponent } from './monitor-body.component';
import { UploadMonitorHeaderComponent } from './monitor-header.component';
import { UploadMonitorComponent } from './monitor.component';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { UploadJobComponent } from '@components/upload-monitor/upload-job.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';

@NgModule({
  imports: [
    CommonModule,
    NzProgressModule,
    NzToolTipModule,
    NzIconModule,
    NzDrawerModule
  ],
  exports: [
    UploadMonitorComponent,
    UploadJobComponent
  ],
  declarations: [
    UploadMonitorComponent,
    UploadMonitorHeaderComponent,
    UploadMonitorBodyComponent,
    UploadJobComponent
  ]
})
export class UploadMonitorModule {
}
