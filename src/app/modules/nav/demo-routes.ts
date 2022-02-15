

export const DEMO_ROUTES = [
  {
    path: '',
    redirectTo: 'table',
    pathMatch: 'full'
  },
  {
    path: 'table',
    data: {title: '标准列表'},
    loadChildren: () => import('../demo/table/demo.module').then(mod => mod.DemoModule),
  }, {
    path: 'advanced-form',
    data: {
      title: '高级表单'
    },
    loadChildren: () => import('../demo/form/advance-form.module').then(mod => mod.AdvanceFormModule)
  }
];
