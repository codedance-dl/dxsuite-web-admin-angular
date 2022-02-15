import { Routes } from '@angular/router';
import { CategoryType } from '@api/models';

export const subRoute: Routes = [
  {
    path: '',
    redirectTo: 'tenant',
    pathMatch: 'full'
  },
  {
    path: 'system',
    data: { title: '系统通知', type: CategoryType.SYSTEM },
    loadChildren: () => import('./notification-subscription-tenant.module').then(m => m.NotificationSubscriptionTenantModule)
  },
  {
    path: 'tenant',
    data: { title: '商户通知', type: CategoryType.TENANT },
    loadChildren: () => import('./notification-subscription-tenant.module').then(m => m.NotificationSubscriptionTenantModule)
  }
];
