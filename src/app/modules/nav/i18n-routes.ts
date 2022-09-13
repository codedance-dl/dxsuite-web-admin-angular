export const I18N_ROUTES = [
  {
    path: '',
    redirectTo: 'message',
    pathMatch: 'full'
  },
  {
    path: 'logs',
    data: {
      title: '系统日志',
      icon: '',
      i18nTitle: {
        'zh-cn': '系统日志',
        'en-gb': 'System Logs',
        'ja-jp': 'システムログ'
      }
    },
    loadChildren: () => import('../i18n/i18n-logs/logs.module').then(mod => mod.I18nLogsModule),
  },
];
