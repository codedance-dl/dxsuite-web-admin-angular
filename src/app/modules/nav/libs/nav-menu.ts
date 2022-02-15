/* eslint-disable @typescript-eslint/no-explicit-any */

import { ActivatedRouteSnapshot } from '@angular/router';

export interface NtNavMenu {
  path?: string;
  data?: { [key: string]: any };
  children?: NtNavMenu[];
  folded?: boolean;
  roles?: any;
  commands?: any[] | string | null;
}

const RESOLVE_TITLE_PLACEHOLDER = /^resolve::/;

/**
 * 从路由数据快照中获取配置信息
 * @param snapshot 路由数据快照
 * @param title 要解析的文本字符串 以 resolve:: 开头
 */
export function resolveTitle(snapshot: ActivatedRouteSnapshot, title: string) {
  if (RESOLVE_TITLE_PLACEHOLDER.test(title)) {
    const paths = title.replace(RESOLVE_TITLE_PLACEHOLDER, '').split('.');
    const key = paths.shift();
    try {
      if (key && snapshot.data?.hasOwnProperty(key)) {

        const data = snapshot.data[key];
        let path = paths.shift();
        let result: any = path ? data[path] : null;
        while (paths.length > 0 && result instanceof Object) {
          path = paths.shift();
          result = path ? result[path] : null;
        }
        return result;
      }
      return key || '';
    } catch (e) {
      console.error(e);
    }
  }
  return title;
}
