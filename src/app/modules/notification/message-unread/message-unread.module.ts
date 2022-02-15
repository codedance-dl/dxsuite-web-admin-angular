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
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';

import { MessageUnreadComponent } from './message-unread.component';
import { MessageUnreadState } from './message-unread.state';

@NgModule({
  imports: [
    CommonModule,
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
    NzDropDownModule,
    NzToolTipModule,
    NzAlertModule,
    NgxsModule.forFeature([MessageUnreadState]),
    RouterModule.forChild([
      {
        path: '',
        component: MessageUnreadComponent
      },
      {
        path: ':messageId',
        data: { title: '消息详情' },
        loadChildren: () => import('./message-unread-details/message-unread-details.module').then(mod => mod.MessageUnreadDetailsModule)
      }
    ])
  ],
  declarations: [MessageUnreadComponent]
})
export class MessageUnreadModule { }
