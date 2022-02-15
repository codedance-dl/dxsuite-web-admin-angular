/* eslint-disable @typescript-eslint/no-explicit-any */

import { Routes } from '@angular/router';

export interface NtNavMenu {
  path?: string;
  data?: {
    [key: string]: any;
  };
  children?: NtNavMenu[];
  folded?: boolean;
  roles?: any;
  commands?: any[] | string | null;
}

export function resolveRouteMenus(routes: Routes): NtNavMenu[] {
  return routes.filter(route => !route.redirectTo && route.path !== '**').map(route => {
    const roles = route.canActivate?.map(activate => activate.ROLE_KEY) || [];
    const menu: NtNavMenu = {
      path: route.path,
      data: route.data,
      roles: roles.flat(Infinity) || []
    };

    if (route.children) {
      menu.children = resolveRouteMenus(route.children);
    }
    return menu;
  });
}
