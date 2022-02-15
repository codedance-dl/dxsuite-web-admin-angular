import { tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Action, createSelector, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';

import { AssetsActions } from './assets.actions';
import {
  AssetsImportColumns as displayedColumnSetting,
  AssetsImportDisplayedColumnName
} from './data/optional-columns';
import { AssetsService } from '@api/assets.service';
import { AssetModel, BaseQuery } from '@api/models';
import { environment } from '../../../../environments/environment';

export interface DataServiceMetadata {
  count: number;
  pageNo: number;
  pageSize: number;
}

export interface AssetsStateModel {
  loaded: boolean;
  items: AssetModel[];
  displayedColumns: string[];
  query?: BaseQuery;
  meta?: DataServiceMetadata;
}

const initialState = (): AssetsStateModel => ({
  items: [],
  loaded: false,
  displayedColumns: displayedColumnSetting.map(column => column.name)
});

@State<AssetsStateModel>({
  name: 'assetsList',
  defaults: initialState()
})
@Injectable()
export class AssetsState implements NgxsOnInit {

  tenantId = environment.orgId;
  constructor(
    private service: AssetsService,
  ) { }

  static getOneById(assetsImportId: string) {
    return createSelector([AssetsState.getItems], (items: AssetModel[]) => items.find(item => item.id === assetsImportId));
  }

  @Selector()
  static getDisplayedColumns(state: AssetsStateModel) {
    return state.displayedColumns;
  }

  @Selector()
  static getItems(state: AssetsStateModel) {
    return state.items;
  }

  @Selector()
  static getMetadata(state: AssetsStateModel) {
    return state.meta;
  }

  @Selector()
  static isLoaded(state: AssetsStateModel) {
    return state.loaded;
  }

  @Selector()
  static isEmpty(state: AssetsStateModel) {
    return state.loaded && state.items.length === 0;
  }

  @Action(AssetsActions.GetAll, { cancelUncompleted: true })
  getAll(context: StateContext<AssetsStateModel>, { query }: AssetsActions.GetAll) {
    if (query.keyword) {
      query.name = query.keyword;
    }
    return this.service.getAll(this.tenantId, query).pipe(tap(res => {
      context.patchState({ items: res.data, meta: res.meta, loaded: true, });
    }));
  }

  @Action(AssetsActions.UpdateDisplayedColumns)
  updateDisplayedColumns(context: StateContext<AssetsStateModel>, { displayedColumns }: AssetsActions.UpdateDisplayedColumns) {
    context.patchState({ displayedColumns });
    localStorage.setItem(AssetsImportDisplayedColumnName, JSON.stringify(displayedColumns));
  }

  ngxsOnInit(context: StateContext<AssetsStateModel>) {
    const columnString = localStorage.getItem(AssetsImportDisplayedColumnName);
    try {
      const columns = JSON.parse(columnString);
      const cols = context.getState().displayedColumns;
      if (Array.isArray(columns) && columns.every(column => cols.includes(column))) {
        context.patchState({ displayedColumns: columns });
      } else {
        localStorage.removeItem(AssetsImportDisplayedColumnName);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

