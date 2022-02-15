/* eslint-disable @typescript-eslint/naming-convention */
export enum UIFontSize {
  小 = 12,
  中 = 13,
  大 = 14,
  特大 = 16
}

export enum UISidebarMode {
  Default,
  Dropdown
}

export namespace UIActions {
  export class ChangeSidebarMode {
    static readonly type = '[UI] 切换菜单模式';
    constructor(public isCollapsed?: boolean) {}
  }

  export class ChangeTheme {
    static readonly type = '[UI] 切换主题';
    constructor(public theme: string) {}
  }

  export class ChangeFontSize {
    static readonly type = '[UI] 设置字体大小';
    constructor(public fontSize: UIFontSize) {}
  }

  export class ToggleReactiveMode {
    static readonly type = '[UI] 设置弹性模式';
    constructor(public open: boolean) {}
  }

  export class ChangeReactiveSidebarMode {
    static readonly type = '[UI] 切换弹性模式下的菜单状态';
    constructor(public sidebarMode: UISidebarMode) {}
  }

  export class ChangeLanguage {
    static readonly type= '[UI] 切换语言';
    constructor(public language: string) {}
  }
}
