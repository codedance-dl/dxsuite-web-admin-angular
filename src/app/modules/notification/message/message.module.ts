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
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';

import { MessageUnreadState } from '../message-unread/message-unread.state';
import { MessageComponent } from './message.component';
import { MessageState } from './message.state';

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
    NgxsModule.forFeature([MessageState, MessageUnreadState]),
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
    NzAlertModule
  ],
  declarations: [MessageComponent]
})
export class MessageModule { }
