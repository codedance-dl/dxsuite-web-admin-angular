import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { NotificationTemplateComponent } from './notification-template.component';
import { NotificationTemplateState } from './notification-template.state';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzTableModule,
    NzPaginationModule,
    NzTagModule,
    NzSpaceModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzSelectModule,
    NzSkeletonModule,
    NzSpinModule,
    NzDropDownModule,
    NzToolTipModule,
    FormsModule,
    NzModalModule,
    NzDividerModule,
    NgxsModule.forFeature([NotificationTemplateState]),
    RouterModule.forChild([
      {
        path: '',
        component: NotificationTemplateComponent
      },
      {
        path: 'add',
        data: { title: '新建模版' },
        loadChildren: () =>
          import('./notification-template-add/notification-template-add.module').then((mod) => mod.NotificationTemplateAddModule)
      },
      {
        path: ':templateId',
        data: { title: '编辑模版' },
        loadChildren: () =>
          import('./notification-template-edit/notification-template-edit.module').then((mod) => mod.NotificationTemplateEditModule)
      }
    ])
  ],
  declarations: [NotificationTemplateComponent]
})
export class NotificationTemplateModule {}
