import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-upload-monitor-body',
  template: `
    <div class="task-wrapper">
      <ng-template nzDrawerContent></ng-template>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'upload-monitor-body'
  }
})
export class UploadMonitorBodyComponent {
}
