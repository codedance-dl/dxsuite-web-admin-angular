import { tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { LogsService } from '@api';
import {
  Action,
  createSelector,
  NgxsOnInit,
  Selector,
  State,
  StateContext,
  Store
} from '@ngxs/store';
import { insertItem, patch, updateItem } from '@ngxs/store/operators';

import { AuditsQuery, ControllerMethods, I18nLogsModel } from '../data/logs.model';
import { LogsColumns as displayedColumnSetting } from '../data/optional-columns';
import { I18nLogsActions } from './logs.actions';

export interface DataServiceMetadata {
  count: number;
  pageNo: number;
  pageSize: number;
}

export interface I18nLogsStateModel {
  loaded: boolean;
  items: I18nLogsModel[];
  controllerMethodsItems: ControllerMethods[];
  displayedColumns: string[];
  query?: AuditsQuery;
  meta?: DataServiceMetadata;
}

const initialState = (): I18nLogsStateModel => ({
  items: [],
  controllerMethodsItems: [],
  loaded: false,
  displayedColumns: displayedColumnSetting.map(column => column.name)
});

@State<I18nLogsStateModel>({
  name: 'i18nLogsList',
  defaults: initialState()
})
@Injectable()
export class I18nLogsState implements NgxsOnInit {

  constructor(
    private store: Store,
    private service: LogsService
  ) { }

  static getOneById(logsId: string) {
    return createSelector([I18nLogsState.getItems], items => items.find(item => item.id === logsId));
  }

  @Selector()
  static getDisplayedColumns(state: I18nLogsStateModel) {
    return state.displayedColumns;
  }

  @Selector()
  static getItems(state: I18nLogsStateModel) {
    return state.items;
  }

  @Selector()
  static getMetadata(state: I18nLogsStateModel) {
    return state.meta;
  }

  @Selector()
  static isLoaded(state: I18nLogsStateModel) {
    return state.loaded;
  }

  @Selector()
  static isEmpty(state: I18nLogsStateModel) {
    return state.loaded && state.items.length === 0;
  }

  @Selector()
  static getControllerMethodItems(state: I18nLogsStateModel) {
    return state.controllerMethodsItems;
  }

  @Action(I18nLogsActions.GetAll, { cancelUncompleted: true })
  getAll(context: StateContext<I18nLogsStateModel>, { query }: I18nLogsActions.GetAll) {
    return this.service.getAll(query).pipe(tap(res => {
      context.patchState({ items: res.data, meta: res.meta, loaded: true, });
    }));
  }

  @Action(I18nLogsActions.GetControllerMethod, { cancelUncompleted: true })
  getControllerMethod(context: StateContext<I18nLogsStateModel>) {
    return this.service.getControllerMethod().pipe(tap(res => {
      context.patchState({ controllerMethodsItems: res.data, loaded: true, });
    }));
  }

  @Action(I18nLogsActions.GetOne)
  getOne(context: StateContext<I18nLogsStateModel>, { logsId }: I18nLogsActions.GetOne) {
    return this.service.getOne(logsId).pipe(tap(res => {
      const state = context.getState();
      const itemState = state.items.find(item => item.id === res.data.id, res.data);
      const updatedItems = itemState
        ? updateItem<I18nLogsModel>(item => item.id === res.data.id, res.data)
        : insertItem<I18nLogsModel>(res.data);

      context.setState(patch({ items: updatedItems }));
    }));
  }

  @Action(I18nLogsActions.UpdateDisplayedColumns)
  updateDisplayedColumns(context: StateContext<I18nLogsStateModel>, { displayedColumns }: I18nLogsActions.UpdateDisplayedColumns) {
    context.patchState({ displayedColumns });
    localStorage.setItem('logsColumns', JSON.stringify(displayedColumns));
  }

  ngxsOnInit(context: StateContext<I18nLogsStateModel>) {
    const columnString = localStorage.getItem('logsColumns');
    try {
      const columns = JSON.parse(columnString);
      const cols = context.getState().displayedColumns;
      if (Array.isArray(columns) && columns.every(column => cols.includes(column))) {
        context.patchState({ displayedColumns: columns });
      } else {
        localStorage.removeItem('logsColumns');
      }
    } catch (e) {
      console.error(e);
    }
  }
}

