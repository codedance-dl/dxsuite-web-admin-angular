import { Component } from '@angular/core';

@Component({
  selector: 'app-scheduled-jobs-skeleton',
  template: `
    <div class='panel'>
      <div class='panel-content'>
        <div class='panel-content-header'>
          <div class='filter' nz-space nzAlign='center'>
            <nz-space-item>
              <nz-skeleton-element class='large' nzType='input' nzActive='true' nzSize='default'></nz-skeleton-element>
              <nz-skeleton-element nzType='button' nzActive='true' nzSize='default'
                                   [style.margin.px]='10'></nz-skeleton-element>
            </nz-space-item>
          </div>
          <div class='actions' nz-space nzAlign='center'>
            <nz-space-item>
              <nz-skeleton-element nzType='button' nzActive='true' nzSize='default'
                                   [style.margin.px]='10'></nz-skeleton-element>
              <nz-skeleton-element nzType='button' nzActive='true' nzSize='default' nzShape='circle'
              ></nz-skeleton-element>
            </nz-space-item>
          </div>
        </div>
        <div class='panel-content-body'>
          <nz-skeleton-element class='data' nzType='input' *ngFor='let i of row' nzActive='true'
                               nzSize='small'></nz-skeleton-element>
        </div>

        <div class='panel-content-footer'>
          <nz-skeleton-element nzType='input' nzActive='true' nzSize='default' class='large'></nz-skeleton-element>
        </div>
      </div>

    </div>
  `,
  styles: [`
      .small {
          width: 50px;
      }

      .medium {
          width: 100px;
      }

      .large {
          width: 200px;
      }

      .data {
          margin: 1rem 0;
          display: block;
          padding: 0 1rem;
          width: 100%;
      }
  `]
})
export class ScheduledJobsSkeletonComponent {
  row = Array(20);
}
