import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
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
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxsModule } from '@ngxs/store';

import { MessageUnreadState } from '../../notification/message-unread/message-unread.state';
import { MessageComponent } from './message.component';
import { I18nMessageState } from './message.state';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: MessageComponent
      },
      {
        path: ':messageId',
        data: { title: '消息详情' },
        loadChildren: () => import('./message-details/message-details.module').then(mod => mod.MessageDetailsModule)
      }
    ]),
    NgxsModule.forFeature([I18nMessageState, MessageUnreadState]),
    NzTableModule,
    NzSpinModule,
    NzIconModule,
    NzTagModule,
    NzPaginationModule,
    NzTypographyModule,
    NzSpaceModule,
    NzCheckboxModule,
    NzButtonModule,
    NzSkeletonModule,
    NzSelectModule,
    FormsModule,
    NzDropDownModule,
    NzToolTipModule,
    NzAlertModule,
    TranslateModule.forChild({
      loader: {
       provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true //隔离服务
    })
  ],
  declarations: [MessageComponent]
})
export class I18nMessageModule { }
