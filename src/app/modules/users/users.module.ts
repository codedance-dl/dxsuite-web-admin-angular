import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';

import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { CommonModule } from '@angular/common';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { CaptchaModule } from '@components/captcha';

import { UsersState } from './state/users.state';
import { UsersComponent } from './users.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: UsersComponent },
    ]),
    NgxsModule.forFeature([UsersState]),
    NzSpaceModule,
    NzInputModule,
    NzDatePickerModule,
    FormsModule,
    NzSpinModule,
    NzTableModule,
    NzTagModule,
    NzTypographyModule,
    NzPaginationModule,
    CommonModule,
    NzSkeletonModule,
    NzIconModule,
    NzButtonModule,
    NzGridModule,
    NzToolTipModule,
    NzDropDownModule,
    CaptchaModule,
  ],
  declarations: [UsersComponent],
  exports: [UsersComponent]
})
export class UsersModule { }
