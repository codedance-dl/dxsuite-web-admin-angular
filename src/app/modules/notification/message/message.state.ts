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
import { MessageActions } from '@constant/actions';

export interface DataServiceMetadata {
  count: number;
  pageNo: number;
  pageSize: number;
}

export interface MessageStateModel {
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

const initialState = (): MessageStateModel => ({
  items: [],
  loaded: false,
  displayedColumns: displayedColumnSetting.map((column) => column.name)
});

@State<MessageStateModel>({
  name: 'messageList',
  defaults: initialState()
})
@Injectable()
export class MessageState implements NgxsOnInit {
  constructor(private service: NotificationService, private store: Store) {}

  static getOneById(customerId: string) {
    return createSelector([MessageState.getItems], (customers: MessageModel[]) => customers.find((item) => item.id === customerId));
  }

  @Selector()
  static getDisplayedColumns(state: MessageStateModel) {
    return state.displayedColumns;
  }

  @Selector()
  static getItems(state: MessageStateModel) {
    return state.items;
  }

  @Selector()
  static getMetadata(state: MessageStateModel) {
    return state.meta;
  }

  @Selector()
  static isLoaded(state: MessageStateModel) {
    return state.loaded;
  }

  @Selector()
  static isEmpty(state: MessageStateModel) {
    return state.loaded && state.items.length === 0;
  }

  @Action(MessageActions.GetAll, { cancelUncompleted: true })
  getAll(context: StateContext<MessageStateModel>, { query }: MessageActions.GetAll) {
    const user = this.store.selectSnapshot(AuthState.getIdentity);
    return this.service.getAll(user.id, query).pipe(tap((res) => context.patchState({ items: res.data, meta: res.meta, loaded: true })));
  }

  @Action(MessageActions.GetOne)
  getOne(context: StateContext<MessageStateModel>, { notificationId }: MessageActions.GetOne) {
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

  @Action(MessageActions.UpdateDisplayedColumns)
  updateDisplayedColumns(context: StateContext<MessageStateModel>, { displayedColumns }: MessageActions.UpdateDisplayedColumns) {
    context.patchState({ displayedColumns });
    localStorage.setItem('messageColumns', JSON.stringify(displayedColumns));
  }

  @Action(MessageActions.SetRead)
  setRead(context: StateContext<MessageStateModel>, { notificationIds }: MessageActions.SetRead) {
    const user = this.store.selectSnapshot(AuthState.getIdentity);
    return this.service.setRead(user.id, notificationIds).pipe(
      tap(() => {
        const updatedItems = updateManyItems<MessageModel>((item) => notificationIds.includes(item.id), patch({ isRead: true }));
        context.setState(patch({ items: updatedItems }));
      })
    );
  }

  ngxsOnInit(context: StateContext<MessageStateModel>) {
    const columnString = localStorage.getItem('messageColumns');
    const columns = JSON.parse(columnString);
    context.patchState({ displayedColumns: columns });
  }
}
