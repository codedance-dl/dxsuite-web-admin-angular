// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  host: 'https://api-dev.dxsuite.cn',
  revision:'1',
  orgId: '60a4dea10d2991747abe1019',
  wsURL: 'api.dxsuite.cn',
  website: 'https://ng-admin-dev.dxsuite.cn/',    // 微信重定向用，目前使用hash路由，业务路径拼接#号
  appId: 'wx631d5d18974894a6'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';
// Included with Angular CLI.
