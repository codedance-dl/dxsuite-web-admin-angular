// const lang = localStorage.getItem('language') || 'zn-cn';

// const I18nTitleMap  = {
//   'zh-cn': '系统日志',
//   'en-gb': 'System Logs',
//   'ja-jp': 'システムログ'
// };

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
  // {
  //   path: 'message',
  //   data: {
  //     title: '全部消息',
  //     i18nTitle:{
  //       'zh-cn':'全部消息',
  //       'en-gb':'All-Message',
  //       'ja-jp':'すべてのメッセージ'
  //     }
  //   },
  //   loadChildren: () => import('../i18n/i18n-message/message.module').then(mod => mod.I18nMessageModule),
  // }
];
