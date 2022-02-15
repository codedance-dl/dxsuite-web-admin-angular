import { Pipe, PipeTransform } from '@angular/core';
import { NtNavMenu } from '@app/modules/nav/map-route-menus';

@Pipe({ name: 'menuFilter' })
export class MenuFilterPipe implements PipeTransform {

  transform(menus: NtNavMenu[], filter: (menu: NtNavMenu) => boolean): NtNavMenu[] {

    if (typeof filter !== 'function') {
      return menus;
    }

    /** step 1: 过滤器筛选一级菜单 */
    menus = menus.filter(menu => {
      if (Array.isArray(menu.children) && menu.children.length > 0) {
        return true;
      } else {
        return filter(menu);
      }
    });

    /** step 2: 从过滤的一级菜单中筛选二级菜单 */
    menus = menus.map(menu => {
      const copiedMenu = { ...menu };
      if (Array.isArray(copiedMenu.children)) {
        copiedMenu.children = copiedMenu.children.filter(child => filter(child));
      }
      return copiedMenu;
    });

    /** step final: 从过滤的一级菜单中筛选二级菜单 */
    const result: NtNavMenu[] = [];

    menus.forEach(menu => {
      // eslint-disable-next-line no-extra-parens
      if (!menu.children || (Array.isArray(menu.children) && menu.children.length > 0)) {
        result.push({ ...menu });
      }
    });

    return result;
  }
}