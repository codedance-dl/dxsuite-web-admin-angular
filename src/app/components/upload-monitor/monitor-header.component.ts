import { ChangeDetectorRef, Component, EventEmitter, Inject, Output, ViewEncapsulation } from '@angular/core';

import { UPLOAD_MONITOR_CONTAINER, UploadMonitorContainer } from './monitor-container';
import { UploadService } from '@components/upload-monitor/upload.service';
import { UploadStatus } from '@components/upload-monitor/upload.models';

@Component({
  selector: 'app-upload-monitor-header',
  templateUrl: 'monitor-header.component.html',
  styleUrls: ['monitor-header.less'],
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'upload-header'
  }
})
export class UploadMonitorHeaderComponent {

  @Output() arrowChange = new EventEmitter<boolean>();

  get hasErrored() {
    return this.errorJobs > 0;
  }

  folded = false;

  errorJobs = 0;

  workingJobs = 0;

  successJobs = 0;

  get workingCount() {
    return this.uploadService.workingCount;
  }

  constructor(
    @Inject(UPLOAD_MONITOR_CONTAINER) private container: UploadMonitorContainer,
    private uploadService: UploadService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.uploadService.queue.subscribe(queue => {
      this.errorJobs = queue.filter(job => job.status === UploadStatus.ERROR).length;
      this.successJobs = queue.filter(job => job.status === UploadStatus.SUCCESS).length;
      this.workingJobs = queue.filter(job => job.status === UploadStatus.BEGIN).length;
      this.changeDetectorRef.markForCheck();
    });
  }

  close() {
    this.container.close();
  }

  toggleArrowChange() {
    this.arrowChange.next(this.folded = !this.folded);
  }
}
