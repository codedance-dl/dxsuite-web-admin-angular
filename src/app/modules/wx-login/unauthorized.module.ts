import { NzIconModule } from 'ng-zorro-antd/icon';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UnauthorizedComponent } from './unauthorized.component';

@NgModule({
  imports: [
    CommonModule,
    NzIconModule,
    RouterModule.forChild([
      {
        path: '',
        component: UnauthorizedComponent,
        data: { title: '微信登录' }
      }
    ])
  ],
  declarations: [UnauthorizedComponent]
})
export class UnauthorizedModule {}
