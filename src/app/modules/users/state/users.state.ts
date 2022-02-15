import { tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { UserService } from '@api';
import {
  Action,
  Selector,
  State,
  StateContext,
  Store
} from '@ngxs/store';

import { UsersModel, UsersQuery } from '../data/users.model';
import { UsersActions } from './users.actions';

export interface DataServiceMetadata {
  count: number;
  pageNo: number;
  pageSize: number;
}

export interface UsersStateModel {
  loaded: boolean;
  items: UsersModel[];
  query?: UsersQuery;
  meta?: DataServiceMetadata;
}

const initialState = (): UsersStateModel => ({
  items: [],
  loaded: false
});

@State<UsersStateModel>({
  name: 'usersList',
  defaults: initialState()
})
@Injectable()
export class UsersState {

  constructor(
    private store: Store,
    private service: UserService
  ) { }

  @Selector()
  static getItems(state: UsersStateModel) {
    return state.items;
  }

  @Selector()
  static getMetadata(state: UsersStateModel) {
    return state.meta;
  }

  @Selector()
  static isLoaded(state: UsersStateModel) {
    return state.loaded;
  }

  @Selector()
  static isEmpty(state: UsersStateModel) {
    return state.loaded && state.items.length === 0;
  }

  @Action(UsersActions.GetAll, { cancelUncompleted: true })
  getAll(context: StateContext<UsersStateModel>, { query }: UsersActions.GetAll) {
    return this.service.getUsers(query).pipe(tap((res) => {
      context.patchState({ items: res.data, meta: res.meta, loaded: true, });
    }));
  }
}

