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
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxsModule } from '@ngxs/store';
import { SecurityModule } from '@store/security';

import { I18nLogsComponent } from './logs.component';
import { I18nLogsState } from './state/logs.state';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const lang = localStorage.getItem('language') || 'zh-cn';

const langTitleMap  = {
  'zh-cn': '系统日志',
  'en-gb': 'System Logs',
  'ja-jp': 'システムログ'
};

@NgModule({
  imports: [
    NgxsModule.forFeature([I18nLogsState]),
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
    NzDropDownModule,
    RouterModule.forChild([
      {
        path: '',
        component: I18nLogsComponent
      }
    ]),
    TranslateModule.forChild({
      loader: {
       provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true //隔离服务
    })
  ],
  declarations: [I18nLogsComponent]
})
export class I18nLogsModule { }
