import { NzIconModule } from 'ng-zorro-antd/icon';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WxLoginComponent } from './wx-login.component';
import { WxLoginResolve } from './wx-login.resolver';

const routes: Routes = [
  {
    path: '',
    component: WxLoginComponent,
    data: { title: '微信登录' },
    runGuardsAndResolvers: 'always',
    resolve: { code: WxLoginResolve }
  },
  {
    path: 'unauthorized',
    loadChildren: () =>
      import('./unauthorized.module').then(
        mod => mod.UnauthorizedModule
      )
  }
];

@NgModule({
  imports: [
    CommonModule,
    NzIconModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WxLoginComponent],
  providers: [WxLoginResolve]
})
export class WxLoginModule {}
