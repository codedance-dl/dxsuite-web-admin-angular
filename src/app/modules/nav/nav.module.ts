import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { EnforcePWDChangeGuard } from 'src/app/store/security/enforce-pwd-change.guard';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DocumentPermissionGuard, UsersPermissionGuard } from '@app/guard';
import { UIState } from '@app/modules/nav/customization';
import { NAV_MENUS } from '@app/modules/nav/nav-token';
import { UploadMonitorModule } from '@components/upload-monitor';
import { NgxsModule } from '@ngxs/store';
import { MenuFilterPipeModule } from '@pipe/menu-filter/menu-filter.module';
import { SecurityModule } from '@store/security';

import { IMPORT_ROUTES } from '../import/import-routes';
import {
  NotificationSubscriptionState
} from '../notification-subscription/notification-subscription.state';
import { MessageUnreadState } from '../notification/message-unread/message-unread.state';
import { MessageState } from '../notification/message/message.state';
import { CustomizationModule } from './customization';
import { DEMO_ROUTES } from './demo-routes';
import { I18N_ROUTES } from './i18n-routes';
import { NT_NAV_CONFIG } from './libs/nav-config';
import { NtNavigationAdapter } from './libs/nav-menu-adapter';
import { LOGS_ROUTES } from './logs-routes';
import { resolveRouteMenus } from './map-route-menus';
import { AppNavComponent } from './nav.component';
import { NOTIFICATION_ROUTES } from './notification-routes';
import { ORGANIZATION_PREMISSIONS_ROUTES } from './organization-permissions-routes';
import { SCHEDULED_ROUTES } from './scheduled-routes';
import { SETTINGS_ROUTES } from './settings-routes';

export const ROUTES = [
  {
    path: '',

    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    data: { title: '首页', icon: 'dashboard' },
    loadChildren: () => import('../dashboard/dashboard.module').then(mod => mod.DashboardModule)
  },
  {
    path: 'users',
    data: {title: '用户管理', icon: 'user'},
    loadChildren: () => import('../users/users.module').then(mod => mod.UsersModule),
    canActivate: [UsersPermissionGuard]
  },
  {
    path: 'organization-permissions',
    data: { title: '组织权限', icon: 'apartment' },
    children: ORGANIZATION_PREMISSIONS_ROUTES
  },
  {
    path: 'import',
    data: { title: '数据导入', icon: 'cloud-upload' },
    children: IMPORT_ROUTES
  },
  {
    path: 'notification',
    data: {title: '消息通知', icon: 'notification'},
    children: NOTIFICATION_ROUTES
  },
  {
    path: 'scheduled',
    data: { title: '定时任务', icon: 'cloud-upload' },
    children: SCHEDULED_ROUTES
  },
  {
    path: 'documents',
    data: { title: '文件管理', icon: 'folder' },
    loadChildren: () => import('../documents/documents.module').then(mod => mod.DocumentsModule),
    canActivate: [DocumentPermissionGuard]
  },
  {
    path: 'logs',
    data: { title: '日志管理', icon: 'reconciliation'},
    children: LOGS_ROUTES
  },
  {
    path: 'settings',
    data: { title: '系统设置', icon: 'setting' },
    children: SETTINGS_ROUTES
  },
  {
    path: 'demo',
    data: { title: '示例列表', icon: 'ant-design' },
    children: DEMO_ROUTES
  },
  {
    path: 'i18n',
    data: {
      title: '国际化',
      icon: 'global'
    },
    children: I18N_ROUTES
  }
];

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: AppNavComponent, children: ROUTES, canActivate: [EnforcePWDChangeGuard] },
      {
        path: 'password/new',
        loadChildren: () => import('../../modules/new-password/new-password.module').then(mod => mod.NewPasswordModule)
      }
    ]),
    NgxsModule.forFeature([UIState, MessageState, MessageUnreadState, NotificationSubscriptionState]),
    NzMenuModule,
    NzLayoutModule,
    NzIconModule,
    CommonModule,
    NzBreadCrumbModule,
    NzDropDownModule,
    NzDrawerModule,
    CustomizationModule,
    UploadMonitorModule,
    NzBadgeModule,
    SecurityModule,
    NzModalModule,
    MenuFilterPipeModule,
    NzButtonModule
  ],
  declarations: [AppNavComponent],
  exports: [AppNavComponent],
  providers: [
    NtNavigationAdapter,
    {
      provide: NAV_MENUS,
      useValue: resolveRouteMenus(ROUTES),
    },
    {
      provide: NT_NAV_CONFIG,
      useValue: {
        routes: ROUTES,
        baseUrl: '/'
      }
    }
  ],
})
export class AppNavModule { }
