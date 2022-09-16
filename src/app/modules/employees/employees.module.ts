import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SecurityModule } from '@app/store';
import { AutoErrorTipModule } from '@components/auto-error-tip/auto-error-tip.module';
import { NgxsModule } from '@ngxs/store';

import { EmployeeEditResolve } from './employee-edit.resolve';
import { EmployeeResetPasswordComponent } from './employee-reset-password';
import { EmployeesEditComponent } from './employees-edit.component';
import { EmployeesComponent } from './employees.component';
import { EmployeesState } from './employees.state';

import { EmployeesSubComponent } from './employees-sub/employees-sub.component';

@NgModule({
  imports: [
    NgxsModule.forFeature([EmployeesState]),
    RouterModule.forChild([
      { path: '', component: EmployeesComponent },
      {
        path: 'add',
        data: { title: '添加成员', action: '添加' },
        component: EmployeesSubComponent,
      },
      {
        path: 'add-invite',
        data: { title: '添加成员', action: '邀请'},
        component: EmployeesSubComponent,
      },
      {
        path: ':employeeId',
        data: { title: '编辑成员'},
        resolve: {
          roles: EmployeeEditResolve
        },
        component: EmployeesEditComponent
      }
    ]),
    CommonModule,
    SecurityModule,
    FormsModule,
    AutoErrorTipModule,
    NzGridModule,
    NzToolTipModule,
    NzTableModule,
    NzDropDownModule,
    NzFormModule,
    NzTagModule,
    NzCardModule,
    NzDividerModule,
    NzPaginationModule,
    NzSpinModule,
    NzSelectModule,
    NzLayoutModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzModalModule,
    NzSpaceModule,
    ReactiveFormsModule,
    NzSkeletonModule
  ],
  declarations: [EmployeesComponent, EmployeesEditComponent, EmployeeResetPasswordComponent, EmployeesSubComponent],
  exports: [EmployeesComponent],
  providers: [EmployeeEditResolve],
  entryComponents: [EmployeeResetPasswordComponent]
})
export class EmployeesModule { }
