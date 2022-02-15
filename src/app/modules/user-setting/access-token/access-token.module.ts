import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAccessTokenComponent } from './access-token.component';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { AccessTokenState } from '../state/access-token.state';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  imports: [
    CommonModule,
    NzTableModule,
    NzSkeletonModule,
    NzSpinModule,
    NzIconModule,
    NzPaginationModule,
    NzModalModule,
    NzDropDownModule,
    NzSpaceModule,
    NgxsModule.forFeature([AccessTokenState]),
    RouterModule.forChild([
      {
        path: '',
        component: UserAccessTokenComponent
      }
    ]),
    NzToolTipModule,
    NzButtonModule
  ],
  declarations: [UserAccessTokenComponent]
})
export class AccessTokenModule { }
