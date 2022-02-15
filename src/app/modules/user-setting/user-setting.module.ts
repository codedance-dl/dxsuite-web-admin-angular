import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSettingComponent } from './user-setting.component';
import { RouterModule } from '@angular/router';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  imports: [
    CommonModule,
    NzMenuModule,
    NzIconModule,
    NzModalModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserSettingComponent,
        children: [
          {
            path: '',
            redirectTo: 'security',
            pathMatch: 'full'
          },
          {
            path: 'security',
            loadChildren: () =>
              import('./security/security.module').then(mod => mod.SecurityModule)
          },
          {
            path: 'profile',
            loadChildren: () =>
              import('./profile/profile.module').then(mod => mod.ProfileModule)
          },
          {
            path: 'change-password',
            loadChildren: () =>
              import('./change-password/password.module').then(mod => mod.PasswordModule)
          },
          {
            path: 'access-token',
            loadChildren: () =>
              import('./access-token/access-token.module').then(mod => mod.AccessTokenModule)
          }
        ]
      }
    ])
  ],
  declarations: [UserSettingComponent]
})
export class UserSettingModule { }
