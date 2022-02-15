import { tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { NotificationService } from '@api';
import { MessageModel } from '@api/models';
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
import { updateManyItems } from '@store/_operators';
import { AuthState } from '@store/auth';

import { MessageColumns as displayedColumnSetting } from './data/optional-columns';
import { I18nMessageActions } from './message.actions';

export interface DataServiceMetadata {
  count: number;
  pageNo: number;
  pageSize: number;
}

export interface I18nMessageStateModel {
  loaded: boolean;
  items: MessageModel[];
  displayedColumns: string[];
  query?: {
    bizType?: string;
    isRead?: boolean;
    pageNo?: number;
    pageSize?: number;
    senderType?: string;
    sortBy?: [string];
  };
  meta?: DataServiceMetadata;
}

const initialState = (): I18nMessageStateModel => ({
  items: [],
  loaded: false,
  displayedColumns: displayedColumnSetting.map((column) => column.name)
});

@State<I18nMessageStateModel>({
  name: 'i18nMessageList',
  defaults: initialState()
})
@Injectable()
export class I18nMessageState implements NgxsOnInit {
  constructor(private service: NotificationService, private store: Store) {}

  static getOneById(customerId: string) {
    return createSelector([I18nMessageState.getItems], (customers: MessageModel[]) => customers.find((item) => item.id === customerId));
  }

  @Selector()
  static getDisplayedColumns(state: I18nMessageStateModel) {
    return state.displayedColumns;
  }

  @Selector()
  static getItems(state: I18nMessageStateModel) {
    return state.items;
  }

  @Selector()
  static getMetadata(state: I18nMessageStateModel) {
    return state.meta;
  }

  @Selector()
  static isLoaded(state: I18nMessageStateModel) {
    return state.loaded;
  }

  @Selector()
  static isEmpty(state: I18nMessageStateModel) {
    return state.loaded && state.items.length === 0;
  }

  @Action(I18nMessageActions.GetAll, { cancelUncompleted: true })
  getAll(context: StateContext<I18nMessageStateModel>, { query }: I18nMessageActions.GetAll) {
    const user = this.store.selectSnapshot(AuthState.getIdentity);
    return this.service.getAll(user.id, query).pipe(tap((res) => context.patchState({ items: res.data, meta: res.meta, loaded: true })));
  }

  @Action(I18nMessageActions.GetOne)
  getOne(context: StateContext<I18nMessageStateModel>, { notificationId }: I18nMessageActions.GetOne) {
    const user = this.store.selectSnapshot(AuthState.getIdentity);
    return this.service.getOne(user.id, notificationId).pipe(
      tap((res) => {
        const state = context.getState();
        const itemState = state.items.find((item) => item.id === res.data.id, res.data);
        const updatedItems = itemState
          ? updateItem<MessageModel>((item) => item.id === res.data.id, res.data)
          : insertItem<MessageModel>(res.data);

        context.setState(patch({ items: updatedItems }));
      })
    );
  }

  @Action(I18nMessageActions.UpdateDisplayedColumns)
  updateDisplayedColumns(context: StateContext<I18nMessageStateModel>, { displayedColumns }: I18nMessageActions.UpdateDisplayedColumns) {
    context.patchState({ displayedColumns });
    localStorage.setItem('messageColumns', JSON.stringify(displayedColumns));
  }

  @Action(I18nMessageActions.SetRead)
  setRead(context: StateContext<I18nMessageStateModel>, { notificationIds }: I18nMessageActions.SetRead) {
    const user = this.store.selectSnapshot(AuthState.getIdentity);
    return this.service.setRead(user.id, notificationIds).pipe(
      tap(() => {
        const updatedItems = updateManyItems<MessageModel>((item) => notificationIds.includes(item.id), patch({ isRead: true }));
        context.setState(patch({ items: updatedItems }));
      })
    );
  }

  ngxsOnInit(context: StateContext<I18nMessageStateModel>) {
    const columnString = localStorage.getItem('messageColumns');
    const columns = JSON.parse(columnString);
    context.patchState({ displayedColumns: columns });
  }
}
