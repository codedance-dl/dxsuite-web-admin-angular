import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LogsService } from '@api';
import {
  Action,
  NgxsOnInit,
  Selector,
  State,
  StateContext,
  Store
} from '@ngxs/store';

import { ControllerMethods, AuditsQuery } from '@constant/common';
import { DemoColumns as displayedColumnSetting } from '../data/demo-columns';
import { DemoActions } from './demo.actions';
import { LogsModel } from '@constant/common';

export interface DataServiceMetadata {
  count: number;
  pageNo: number;
  pageSize: number;
}

export interface DemoStateModel {
  loaded: boolean;
  items: LogsModel[];
  controllerMethodsItems: ControllerMethods[];
  displayedColumns: string[];
  query?: AuditsQuery;
  meta?: DataServiceMetadata;
}

const initialState = (): DemoStateModel => ({
  items: [],
  controllerMethodsItems: [],
  loaded: false,
  displayedColumns: displayedColumnSetting.map(column => column.name)
});

@State<DemoStateModel>({
  name: 'demo',
  defaults: initialState()
})
@Injectable()
export class DemoState implements NgxsOnInit {

  constructor(
    private store: Store,
    private service: LogsService
  ) { }

  @Selector()
  static getDisplayedColumns(state: DemoStateModel) {
    return state.displayedColumns;
  }

  @Selector()
  static getItems(state: DemoStateModel) {
    return state.items;
  }

  @Selector()
  static getMetadata(state: DemoStateModel) {
    return state.meta;
  }

  @Selector()
  static isLoaded(state: DemoStateModel) {
    return state.loaded;
  }

  @Selector()
  static isEmpty(state: DemoStateModel) {
    return state.loaded && state.items.length === 0;
  }

  @Action(DemoActions.GetAll, { cancelUncompleted: true })
  getAll(context: StateContext<DemoStateModel>, { query }: DemoActions.GetAll) {
    return this.service.getAll(query).pipe(tap(res => {
      context.patchState({ items: res.data, meta: res.meta, loaded: true });
    }));
  }

  @Action(DemoActions.UpdateDisplayedColumns)
  updateDisplayedColumns(context: StateContext<DemoStateModel>, { displayedColumns }: DemoActions.UpdateDisplayedColumns) {
    context.patchState({ displayedColumns });
    localStorage.setItem('demoColumns', JSON.stringify(displayedColumns));
  }

  ngxsOnInit(context: StateContext<DemoStateModel>) {
    const columnString = localStorage.getItem('demoColumns');
    try {
      const columns = JSON.parse(columnString);
      const cols = context.getState().displayedColumns;
      if (Array.isArray(columns) && columns.every(column => cols.includes(column))) {
        context.patchState({ displayedColumns: columns });
      } else {
        localStorage.removeItem('demoColumns');
      }
    } catch (e) {
      console.error(e);
    }
  }
}

