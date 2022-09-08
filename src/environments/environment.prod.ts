import { pw, text } from '@constant/common';
export const environment = {
  production: true,
  host: 'https://api.dxsuite.cn',
  revision:'1',
  orgId: '6073bf8359a60912ebc9f85a',
  wsURL: 'api.dxsuite.cn',
  // host: 'http://127.0.0.1:8991',
  website: 'https://ng-admin.dxsuite.cn/',  // 微信重定向用，目前使用hash路由，业务路径拼接#号
  appId: 'wx5b68e99bdbae7f87',
  
  // 密码相关
  eyeInvisible: 'eye-invisible',
  eye: 'eye',
  pw,
  text,
};
