import { Observable } from 'rxjs';
import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';

import { UPLOAD_MONITOR_CONTAINER, UploadMonitorContainer } from './monitor-container';
import { UploadJob } from './upload.models';
import { UploadService } from './upload.service';

@Component({
  selector: 'app-upload-monitor',
  templateUrl: 'monitor.component.html',
  styleUrls: ['monitor.less'],
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide:UPLOAD_MONITOR_CONTAINER, useExisting: UploadMonitorComponent }
  ],
  // animations: [
  //   trigger('slideOutRight', [
  //     transition('* => void', fadeOutX({ a: 0, b: '15%' }, .3))
  //   ]),
  //   trigger('fade', [
  //     transition('void => *', fadeIn(.15)),
  //     transition('* => void', fadeOut(.15))
  //   ])
  // ],
  host: {
    class: 'upload-monitor'
  },
})
export class UploadMonitorComponent implements UploadMonitorContainer {

  queue$: Observable<UploadJob[]> = this.uploadService.queue;

  folded = false;

  constructor(
    private uploadService: UploadService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  remove(job: UploadJob) {
    this.uploadService.cancel(job);
    this.changeDetectorRef.markForCheck();
  }

  close() {
    this.uploadService.cancelAll();
    this.changeDetectorRef.markForCheck();
  }

  onArrowChange(folded) {
    this.folded = folded;
    this.changeDetectorRef.markForCheck();
  }
}
