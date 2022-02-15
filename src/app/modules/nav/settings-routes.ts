import { Routes } from '@angular/router';

import { NotificationSubscriptionPermissionGuard, NotificationTemplatePermissionGuard, SystemPermissionGuard } from '../../guard';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'parameters',
    pathMatch: 'full'
  },
  {
    path: 'parameters',
    data: { title: '参数配置' },
    loadChildren: () => import('../parameter-setting/parameter-setting.module').then(m => m.ParameterSettingModule),
    canActivate: [SystemPermissionGuard]
  },
  {
    path: 'notification-template',
    data: { title: '通知模版' },
    loadChildren: () => import('../notification-template/notification-template.module').then(m => m.NotificationTemplateModule),
    canActivate: [NotificationTemplatePermissionGuard],
  },
  {
    path: 'notification-subscription',
    data: { title: '通知设置' },
    loadChildren: () => import('../notification-subscription/notification-subscription.module').then(m => m.NotificationSubscriptionModule),
    canActivate: [NotificationSubscriptionPermissionGuard],
  }
];
