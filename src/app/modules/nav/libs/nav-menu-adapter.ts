/* eslint-disable @typescript-eslint/no-explicit-any */
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NAV_MENUS } from '@app/modules/nav/nav-token';

import { NT_NAV_CONFIG, NtNavConfig, NtNavUrlTreeStrategy } from './nav-config';
import { NtNavMenu, resolveTitle } from './nav-menu';

interface Tree {
  icon: string;
  title: string;
  url: string | string[];
  i18nTitle: {
    [key: string]: string;
  };
}

@Injectable()
export class NtNavigationAdapter implements OnDestroy {
  readonly activatedUrlTree = new BehaviorSubject<any[]>([]);

  readonly activeUrl = new BehaviorSubject<any>({});
  private readonly destroy = new Subject();

  // private menus: NtNavMenu[] = [];

  private menus = new BehaviorSubject<NtNavMenu[]>([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(NT_NAV_CONFIG) public config: NtNavConfig,
    @Inject(NAV_MENUS) menus: NtNavMenu[]
  ) {

    this.menus.next(this.fillNavMenuUrls(menus));

    router.events
      .pipe(
        takeUntil(this.destroy),
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => this.buildUrlTree(this.route));
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  /** 填充菜单的 url */
  private fillNavMenuUrls(menus: NtNavMenu[], parentPath?: string) {
    menus.forEach(menu => {
      const commands = [this.config.baseUrl || './'];
      if (parentPath) {
        commands.push(parentPath);
      }
      if (menu.path) {
        commands.push(menu.path);
      }
      menu.commands = commands;

      if (Array.isArray(menu.children) && menu.children.length > 0) {
        this.fillNavMenuUrls(menu.children, menu.path);
      }
    });

    return menus;
  }

  /**
    * 构建面包屑结构
    * @param route 当前激活的路由对象
    */
  private buildUrlTree(route: ActivatedRoute) {
    let url: string[] = [];

    const tree: Tree[] = [];

    while (route.firstChild) {
      route = route.firstChild;
      const snapshot = route.snapshot;
      if (snapshot.data && snapshot.data.title && snapshot.url.length > 0) {
        const data = snapshot.data;
        let title = '';
        title = resolveTitle(snapshot, data.title);
        url = url.concat(snapshot.url.map(segment => segment.path));

        tree.push({ title, url, icon: data.icon, i18nTitle: data.i18nTitle });
      }
    }

    this.activeUrl.next(tree[tree.length - 1]);
    if (this.config.urlTreeStrategy === NtNavUrlTreeStrategy.OnlyParents) {
      tree.splice(tree.length - 1, 1);
    }

    this.activatedUrlTree.next(tree);
  }
}
