import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WxLoginModule } from './modules/wx-login/wx-login.module';
import { AuthGuard } from './store';

const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/nav/nav.module').then(mod => mod.AppNavModule), canActivate: [AuthGuard] },
  { path: 'login', loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule) },
  { path: 'register', loadChildren: () => import('./modules/register/register.module').then(m => m.RegisterModule) },
  { path: 'protocol', loadChildren: () => import('./modules/register/protocol.module').then(mod => mod.ProtocolModule) },
  {
    path: 'reset-password',
    loadChildren: () => import('./modules/reset-password/reset-password.module').then(mod => mod.ResetPasswordModule)
  },
  {
    path: 'invite',
    loadChildren: () => import(`./modules/invite/invite.module`).then(mod => mod.InviteModule)
  },
  {
    path: 'user-settings',
    data: { title: '用户设置'},
    loadChildren: () => import('./modules/user-setting/user-setting.module').then(m => m.UserSettingModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'user-settings/security/change-mobile',
    loadChildren: () => import('./modules/change-mobile/change-mobile.module').then(mod => mod.ChangeMobileModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'user-settings/security/change-email',
    loadChildren: () => import('./modules/change-email/change-email.module').then(mod => mod.ChangeEmailModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'unauthorized',
    loadChildren: () => import('./modules/unauthorized/unauthorized.module').then(mod => mod.UnauthorizedModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'wx-login',
    loadChildren: () => import('./modules/wx-login/wx-login.module').then(mod => WxLoginModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
