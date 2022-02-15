import { NzButtonModule } from 'ng-zorro-antd/button';
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
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzUploadModule } from 'ng-zorro-antd/upload';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';

import { AssetsComponent } from './assets.component';
import { AssetsState } from './assets.state';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzDividerModule,
    NzPaginationModule,
    NzLayoutModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzSpaceModule,
    ReactiveFormsModule,
    NzSkeletonModule,
    NzUploadModule,
    NzSpinModule,
    NzDropDownModule,
    NzToolTipModule,
    NgxsModule.forFeature([AssetsState]),
    RouterModule.forChild([
      {
        path: '',
        component: AssetsComponent
      }
    ])
  ],
  declarations: [AssetsComponent]
})
export class AssetsModule { }
