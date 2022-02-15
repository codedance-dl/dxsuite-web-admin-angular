import { Routes } from '@angular/router';
import { EmployeePermissionGuard, RolePermissionGuard } from '@app/guard';

export const ORGANIZATION_PREMISSIONS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'employees',
    pathMatch: 'full'
  },
  {
    path: 'employees',
    loadChildren: () => import('../employees/employees.module').then(m => m.EmployeesModule),
    data: { title: '成员管理' },
    canActivate: [EmployeePermissionGuard]
  },
  {
    path: 'roles',
    loadChildren: () => import('../roles/roles.module').then(m => m.RolesModule),
    data: { title: '角色管理' },
    canActivate: [RolePermissionGuard]
  }
];
