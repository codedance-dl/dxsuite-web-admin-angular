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

import { OperationsLogsModel, ControllerMethods, AuditsQuery } from '../data/operations-logs.model';
import { LogsColumns as displayedColumnSetting } from '../data/optional-columns';
import { OperationsLogsActions } from './operations-logs.actions';

export interface DataServiceMetadata {
  count: number;
  pageNo: number;
  pageSize: number;
}

export interface LogsStateModel {
  loaded: boolean;
  items: OperationsLogsModel[];
  controllerMethodsItems: ControllerMethods[];
  displayedColumns: string[];
  query?: AuditsQuery;
  meta?: DataServiceMetadata;
}

const initialState = (): LogsStateModel => ({
  items: [],
  controllerMethodsItems: [],
  loaded: false,
  displayedColumns: displayedColumnSetting.map(column => column.name)
});

@State<LogsStateModel>({
  name: 'logs',
  defaults: initialState()
})
@Injectable()
export class OperationsLogsState implements NgxsOnInit {

  constructor(
    private store: Store,
    private service: LogsService
  ) { }

  static getOneById(logsId: string) {
    return createSelector([OperationsLogsState.getItems], items => items.find(item => item.id === logsId));
  }

  @Selector()
  static getDisplayedColumns(state: LogsStateModel) {
    return state.displayedColumns;
  }

  @Selector()
  static getItems(state: LogsStateModel) {
    return state.items;
  }

  @Selector()
  static getMetadata(state: LogsStateModel) {
    return state.meta;
  }

  @Selector()
  static isLoaded(state: LogsStateModel) {
    return state.loaded;
  }

  @Selector()
  static isEmpty(state: LogsStateModel) {
    return state.loaded && state.items.length === 0;
  }

  @Selector()
  static getControllerMethodItems(state: LogsStateModel) {
    return state.controllerMethodsItems;
  }

  @Action(OperationsLogsActions.GetAll, { cancelUncompleted: true })
  getAll(context: StateContext<LogsStateModel>, { query }: OperationsLogsActions.GetAll) {
    return this.service.getAll(query).pipe(tap(res => {
      context.patchState({ items: res.data, meta: res.meta, loaded: true, });
    }));
  }

  @Action(OperationsLogsActions.GetControllerMethod, { cancelUncompleted: true })
  getControllerMethod(context: StateContext<LogsStateModel>) {
    return this.service.getControllerMethod().pipe(tap(res => {
      context.patchState({ controllerMethodsItems: res.data, loaded: true, });
    }));
  }

  @Action(OperationsLogsActions.GetOne)
  getOne(context: StateContext<LogsStateModel>, { logsId }: OperationsLogsActions.GetOne) {
    return this.service.getOne(logsId).pipe(tap(res => {
      const state = context.getState();
      const itemState = state.items.find(item => item.id === res.data.id, res.data);
      const updatedItems = itemState
        ? updateItem<OperationsLogsModel>(item => item.id === res.data.id, res.data)
        : insertItem<OperationsLogsModel>(res.data);

      context.setState(patch({ items: updatedItems }));
    }));
  }

  @Action(OperationsLogsActions.UpdateDisplayedColumns)
  updateDisplayedColumns(context: StateContext<LogsStateModel>, { displayedColumns }: OperationsLogsActions.UpdateDisplayedColumns) {
    context.patchState({ displayedColumns });
    localStorage.setItem('logsColumns', JSON.stringify(displayedColumns));
  }

  ngxsOnInit(context: StateContext<LogsStateModel>) {
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

