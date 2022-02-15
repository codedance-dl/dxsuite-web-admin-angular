import { Routes } from '@angular/router';
import { ImportPermissionGuard, ImportLogsPermissionGuard } from '@app/guard';

export const IMPORT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'import',
    pathMatch: 'full'
  },
  {
    path: 'import',
    data: { title: '资产导入' },
    loadChildren: () => import('./assets/assets.module').then(mod => mod.AssetsModule),
    canActivate: [ImportPermissionGuard]
  },
  {
    path: 'logs',
    data: { title: '导入日志' },
    loadChildren: () => import('./logs/logs.module').then(mod => mod.LogsModule),
    canActivate: [ImportLogsPermissionGuard]
  }
];
