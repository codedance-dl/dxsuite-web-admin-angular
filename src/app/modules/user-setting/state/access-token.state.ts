import { tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { AccessTokenService } from '@api';
import {
  Action,
  NgxsOnInit,
  Selector,
  State,
  StateContext,
  Store
} from '@ngxs/store';

import { AccessTokenColumns as displayedColumnSetting } from '../data/access-token-columns';
import { AccessTokenModel } from '../data/access-token.model';
import { AccessTokenActions } from './access-token.actions';
import { Query } from '@api/models';

export interface DataServiceMetadata {
  count: number;
  pageNo: number;
  pageSize: number;
}

export interface AccessTokenStateModel {
  loaded: boolean;
  items: AccessTokenModel[];
  displayedColumns: string[];
  query?: Query;
  meta?: DataServiceMetadata;
}

const initialState = (): AccessTokenStateModel => ({
  items: [],
  loaded: false,
  displayedColumns: displayedColumnSetting.map(column => column.name)
});

@State<AccessTokenStateModel>({
  name: 'AccessToken',
  defaults: initialState()
})
@Injectable()
export class AccessTokenState implements NgxsOnInit {

  constructor(
    private store: Store,
    private service: AccessTokenService
  ) { }

  @Selector()
  static getDisplayedColumns(state: AccessTokenStateModel) {
    return state.displayedColumns;
  }

  @Selector()
  static getItems(state: AccessTokenStateModel) {
    return state.items;
  }

  @Selector()
  static getMetadata(state: AccessTokenStateModel) {
    return state.meta;
  }

  @Selector()
  static isLoaded(state: AccessTokenStateModel) {
    return state.loaded;
  }

  @Selector()
  static isEmpty(state: AccessTokenStateModel) {
    return state.loaded && state.items.length === 0;
  }

  @Action(AccessTokenActions.GetAll, { cancelUncompleted: true })
  getAll(context: StateContext<AccessTokenStateModel>, { userId, query }: AccessTokenActions.GetAll) {
    return this.service.searchAccessTokens(userId, query).pipe(
      tap(res => {
        context.patchState({ items: res.data, meta: res.meta, loaded: true });
      })
    );
  }

  @Action(AccessTokenActions.UpdateDisplayedColumns)
  updateDisplayedColumns(context: StateContext<AccessTokenStateModel>, { displayedColumns }: AccessTokenActions.UpdateDisplayedColumns) {
    context.patchState({ displayedColumns });
    localStorage.setItem('accessTokenColumns', JSON.stringify(displayedColumns));
  }

  ngxsOnInit(context: StateContext<AccessTokenStateModel>) {
    const columnString = localStorage.getItem('accessTokenColumns');
    try {
      const columns = JSON.parse(columnString);
      const cols = context.getState().displayedColumns;
      if (Array.isArray(columns) && columns.every(column => cols.includes(column))) {
        context.patchState({ displayedColumns: columns });
      } else {
        localStorage.removeItem('accessTokenColumns');
      }
    } catch (e) {
      console.error(e);
    }
  }
}
