import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { UIActions, UIFontSize, UISidebarMode } from './user-interface.actions';

export interface UIStateModel {
  theme: string;
  sidebarMode: UISidebarMode;
  isCollapsed: boolean;
  fontSize: UIFontSize;
  skin?: string;
  reactiveMode: boolean;
  reactiveSidebarMode: UISidebarMode;
  language: string;
}

const initialState = (): UIStateModel => ({
  theme: 'dark',
  reactiveMode: false,
  reactiveSidebarMode: UISidebarMode.Default,
  fontSize: UIFontSize.大,
  sidebarMode: UISidebarMode.Default,
  isCollapsed: false,
  language: 'zh'
});

@State<UIStateModel>({
  name: 'ui',
  defaults: initialState()
})
@Injectable()
export class UIState {

  @Selector()
  static isDropdownMode(state: UIStateModel) {
    if (state.reactiveMode) {
      return state.reactiveSidebarMode === UISidebarMode.Dropdown;
    } else {
      return state.sidebarMode === UISidebarMode.Dropdown;
    }
  }

  @Selector()
  static isDropdownSidebar(state: UIStateModel) {
    return state.sidebarMode === UISidebarMode.Dropdown;
  }

  @Selector()
  static isSidebarCollapsed(state: UIStateModel) {
    return state.isCollapsed;
  }

  @Selector()
  static currentTheme(state: UIStateModel) {
    return state.theme;
  }

  @Selector()
    static getLanguage(state: UIStateModel) {
    return state.language;
  }


  @Action(UIActions.ChangeSidebarMode)
  changeSidebarMode(context: StateContext<UIStateModel>, { isCollapsed }: UIActions.ChangeSidebarMode) {
    return context.patchState({ isCollapsed: isCollapsed || !context.getState().isCollapsed});
  }

  @Action(UIActions.ChangeTheme)
  changeTheme(context: StateContext<UIStateModel>, { theme }: UIActions.ChangeTheme) {
    return context.patchState({ theme });
  }

  @Action(UIActions.ChangeFontSize)
  changeFontSize(context: StateContext<UIStateModel>, { fontSize }: UIActions.ChangeFontSize) {
    return context.patchState({ fontSize });
  }

  @Action(UIActions.ToggleReactiveMode)
  toggleReactiveMode(context: StateContext<UIStateModel>, { open }: UIActions.ToggleReactiveMode) {
    return context.patchState({ reactiveMode: open });
  }

  @Action(UIActions.ChangeReactiveSidebarMode)
  changeReactiveSidebarMode(context: StateContext<UIStateModel>, { sidebarMode }: UIActions.ChangeReactiveSidebarMode) {
    return context.patchState({ reactiveSidebarMode: sidebarMode });
  }

  @Action(UIActions.ChangeLanguage)
  changeLanguague(context: StateContext<UIStateModel>, { language }: UIActions.ChangeLanguage) {
    return context.patchState({ language });
  }
}
