import { NotificationMessagePermissionGuard, NotificationUnreadMessagePermissionGuard, ReceiveConfigPermissionGuard } from '@app/guard';

export const NOTIFICATION_ROUTES = [
  {
    path: '',
    redirectTo: 'message',
    pathMatch: 'full'
  },
  {
    path: 'message',
    data: {title: '全部消息'},
    loadChildren: () => import('../notification/message/message.module').then(mod => mod.MessageModule),
    canActivate: [NotificationMessagePermissionGuard]
  },
  {
    path: 'message-unread',
    data: {title: '未读消息'},
    loadChildren: () => import('../notification/message-unread/message-unread.module').then(mod => mod.MessageUnreadModule),
    canActivate: [NotificationUnreadMessagePermissionGuard]
  },
  {
    path: 'receive-config',
    data: {title: '通知接收管理'},
    loadChildren: () => import('../notification/receive-config/receive-config.module').then(mod => mod.ReceiveConfigModule),
    canActivate: [ReceiveConfigPermissionGuard]
  }
];
