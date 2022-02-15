import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';

import { UIActions, UIFontSize, UISidebarMode } from './user-interface.actions';
import { UIState, UIStateModel } from './user-interface.state';

const getFontSizeObject = (keys: string[]) => {
  const obj: { [key: string]: number } = {};
  keys.forEach(key => {
    obj[key] = UIFontSize[key];
  });
  return obj;
};

@Component({
  selector: 'app-customization',
  templateUrl: 'customization.component.html',
  styleUrls: ['customization.component.less']
})
export class CustomizationComponent implements OnInit, OnDestroy {

  @Select(UIState) ui$: Observable<UIStateModel>;

  @Select(UIState.isSidebarCollapsed) isCollapsed$: Observable<boolean>;

  @Select(UIState.currentTheme) theme$: Observable<string>;

  ui: UIStateModel;
  reactiveMode: boolean;

  fontSizeKeys: string[] = Object.values(UIFontSize).filter(val => typeof val === 'string') as string[];

  fontSizeObject = getFontSizeObject(this.fontSizeKeys);

  get _trackFontSize() {
    return UIFontSize[this.ui.fontSize];
  }

  private readonly _destroy = new Subject();

  constructor(private store: Store) { }

  @HostListener('window:resize')
  onWindowResize() {
    this.checkSidebarFolded();
  }

  ngOnInit() {
    this.store
      .select(UIState)
      .pipe(takeUntil(this._destroy))
      .subscribe(ui => {
        this.ui = ui;
        this.updateGlobalFontSize();
      });

    this.checkSidebarFolded();
  }

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
  }

  changeSidebarMode(event: Event) {
    console.log(event);
    this.store.dispatch(new UIActions.ChangeSidebarMode());
  }

  changeFontSize(fontSize: UIFontSize) {
    this.store.dispatch(new UIActions.ChangeFontSize(fontSize));
  }

  toggleReactiveMode(change) {
    this.store
      .dispatch(new UIActions.ToggleReactiveMode(change.checked))
      .subscribe(() => this.checkSidebarFolded());
  }

  changeTheme(change) {
    this.store.dispatch(new UIActions.ChangeTheme(change.checked ? 'dark' : 'light'));
  }

  private checkSidebarFolded() {
    if (this.ui.reactiveMode) {
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;
      const dropdownMode = windowWidth < 1280 ? UISidebarMode.Dropdown : UISidebarMode.Default;
      if (dropdownMode !== this.ui.reactiveSidebarMode) {
        this.store.dispatch(new UIActions.ChangeReactiveSidebarMode(dropdownMode));
      }
    }
  }

  private updateGlobalFontSize() {
    if (this.ui.reactiveMode) {
      document.body.parentElement.style.removeProperty('font-size');
    } else {
      document.body.parentElement.style.fontSize = `${this.ui.fontSize}px`;
    }
  }
}
