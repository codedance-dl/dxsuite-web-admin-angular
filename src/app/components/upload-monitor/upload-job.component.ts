import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { UploadJob } from './upload.models';

@Component({
  selector: 'app-upload-job',
  templateUrl: 'upload-job.component.html',
  styleUrls: ['upload-job.less'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'upload-job',
    '[class.waiting]': 'job.status === 0',
    '[class.loading]': 'job.status === 1',
    '[class.completed]': 'job.status === 2',
    '[class.error]': 'job.status === 3'
  }
})
export class UploadJobComponent {

  @Input() job: UploadJob;

  @Output() remove = new EventEmitter<UploadJob>();

  @Output() retry = new EventEmitter<UploadJob>();
}
