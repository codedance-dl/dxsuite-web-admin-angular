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
import { AuthState } from '@store/auth';

import { MessageUnreadColumns as displayedColumnSetting } from './data/optional-columns';
import { MessageUnreadActions } from './message-unread.actions';

export interface DataServiceMetadata {
  count: number;
  pageNo: number;
  pageSize: number;
}

export interface MessageUnreadStateModel {
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

const initialState = (): MessageUnreadStateModel => ({
  items: [],
  loaded: false,
  displayedColumns: displayedColumnSetting.map((column) => column.name)
});

@State<MessageUnreadStateModel>({
  name: 'messageUnreadList',
  defaults: initialState()
})
@Injectable()
export class MessageUnreadState implements NgxsOnInit {
  constructor(private service: NotificationService, private store: Store) { }

  static getOneById(customerId: string) {
    return createSelector([MessageUnreadState.getItems], (customers: MessageModel[]) =>
      customers.find((item) => item.id === customerId)
    );
  }

  static getUnreadByLimit(limit = 5) {
    return createSelector([MessageUnreadState.getItems], (messages: MessageModel[]) => messages.slice(0, limit));
  }

  @Selector()
  static getDisplayedColumns(state: MessageUnreadStateModel) {
    return state.displayedColumns;
  }

  @Selector()
  static getItems(state: MessageUnreadStateModel) {
    return state.items;
  }

  @Selector()
  static getMetadata(state: MessageUnreadStateModel) {
    return state.meta;
  }

  @Selector()
  static isLoaded(state: MessageUnreadStateModel) {
    return state.loaded;
  }

  @Selector()
  static isEmpty(state: MessageUnreadStateModel) {
    return state.loaded && state.items.length === 0;
  }

  @Action(MessageUnreadActions.GetAll, { cancelUncompleted: true })
  getAll(context: StateContext<MessageUnreadStateModel>, { query }: MessageUnreadActions.GetAll) {
    const user = this.store.selectSnapshot(AuthState.getIdentity);
    return this.service.getAll(user.id, { ...query, isRead: false }).pipe(
      tap((res) => context.patchState({ items: res.data, meta: res.meta, loaded: true })
      )
    );
  }

  @Action(MessageUnreadActions.GetOne)
  getOne(context: StateContext<MessageUnreadStateModel>, { notificationId }: MessageUnreadActions.GetOne) {
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

  @Action(MessageUnreadActions.SetRead)
  setRead(context: StateContext<MessageUnreadStateModel>, { notificationIds }: MessageUnreadActions.SetRead) {
    const user = this.store.selectSnapshot(AuthState.getIdentity);
    return this.service.setRead(user.id, notificationIds);
  }

  @Action(MessageUnreadActions.UpdateDisplayedColumns)
  updateDisplayedColumns(
    context: StateContext<MessageUnreadStateModel>,
    { displayedColumns }: MessageUnreadActions.UpdateDisplayedColumns
  ) {
    context.patchState({ displayedColumns });
    localStorage.setItem('message-unreadColumns', JSON.stringify(displayedColumns));
  }

  ngxsOnInit(context: StateContext<MessageUnreadStateModel>) {
    const columnString = localStorage.getItem('message-unreadColumns');
    try {
      const columns = JSON.parse(columnString);
      if (columns) {
        context.patchState({ displayedColumns: columns });
      }
    } catch (e) {
      console.error(e);
    }
  }
}
