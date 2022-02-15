import { Routes } from '@angular/router';
import { ScheduledJobExecutionsPermissionGuard, ScheduledJobsPermissionGuard } from '@app/guard';

export const SCHEDULED_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'scheduled-jobs',
    pathMatch: 'full'
  },
  {
    path: 'scheduled-jobs',
    data: { title: '定时任务' },
    loadChildren: () => import('../scheduled/scheduled-jobs/scheduled-jobs.module').then(m => m.ScheduledJobsModule),
    canActivate: [ScheduledJobsPermissionGuard]
  },
  {
    path: 'scheduled-job-executions',
    data: { title: '执行记录' },
    loadChildren: () => import('../scheduled/scheduled-job-executions/scheduled-jobs-executions.module').then(m => m.ScheduledJobsExecutionsModule),
    canActivate: [ScheduledJobExecutionsPermissionGuard]
  },
];
