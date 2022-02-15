import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AutoErrorTipModule } from '@components/auto-error-tip/auto-error-tip.module';
import { NgxsModule } from '@ngxs/store';
import { SecurityModule } from '@app/store/security';

import { RolesAddComponent } from './add.component';
import { RolesEditComponent } from './edit.component';
import { RolesPrivilegesComponent } from './privileges.component';
import { RolesComponent } from './roles.component';
import { RolesState } from './roles.state';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzPaginationModule,
    NzInputModule,
    NzFormModule,
    NzIconModule,
    NzButtonModule,
    NzTagModule,
    NzModalModule,
    NzSkeletonModule,
    NzDropDownModule,
    NzDividerModule,
    NzToolTipModule,
    NzSpaceModule,
    NzSpinModule,
    NzCheckboxModule,
    AutoErrorTipModule,
    NzLayoutModule,
    NzTypographyModule,
    SecurityModule,
    NgxsModule.forFeature([RolesState]),
    RouterModule.forChild([
      { path: '', component: RolesComponent },
      {
        path: ':roleId',
        data: {
          title: '权限设置'
        },
        component: RolesPrivilegesComponent
      }
    ])
  ],
  declarations: [RolesComponent, RolesPrivilegesComponent, RolesAddComponent, RolesEditComponent],
  entryComponents: [
    RolesAddComponent,
    RolesEditComponent
  ],
  exports: [RolesComponent]
})
export class RolesModule { }
