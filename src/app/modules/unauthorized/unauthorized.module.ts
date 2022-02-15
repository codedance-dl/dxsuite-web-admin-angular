import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { UnauthorizedComponent } from './unauthorized.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzModalModule,
    RouterModule.forChild([
      { path: '', component: UnauthorizedComponent },
    ]),
  ],
  entryComponents: [
    UnauthorizedComponent
  ],
  declarations: [
    UnauthorizedComponent
  ]
})
export class UnauthorizedModule { }
