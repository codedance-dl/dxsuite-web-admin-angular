import { Routes } from '@angular/router';
import { LogsPermissionGuard } from '@app/guard';

export const LOGS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'operations-logs',
    pathMatch: 'full'
  },
  {
    path: 'operations-logs',
    loadChildren: () => import('../logs/operations-logs/operations-logs.module').then(m => m.OperationsLogsModule),
    data: { title: '系统日志' },
    canActivate: [LogsPermissionGuard]
  }
];
