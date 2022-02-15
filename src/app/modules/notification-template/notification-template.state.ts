import { switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { NotificationTemplateService } from '@api';
import { Action, createSelector, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import { append, insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';

import { NotificationTemplateModel } from './data/notification-template.model';
import { NotificationTemplateColumns as displayedColumnSetting } from './data/optional-columns';
import { NotificationTemplateActions } from './notification-template.actions';

export interface DataServiceMetadata {
  count: number;
  pageNo: number;
  pageSize: number;
}

export interface NotificationTemplateStateModel {
  loaded: boolean;
  items: NotificationTemplateModel[];
  displayedColumns: string[];
  query?: {
    name?: string;
    disabled?: boolean;
    pageNo?: number;
    pageSize?: number;
    sortBy?: [string];
    keyword?: string;
    status?: boolean;
  };
  meta?: DataServiceMetadata;
}

const initialState = (): NotificationTemplateStateModel => ({
  items: [],
  loaded: false,
  displayedColumns: displayedColumnSetting.map((column) => column.name)
});

@State<NotificationTemplateStateModel>({
  name: 'notificationTemplateList',
  defaults: initialState()
})
@Injectable()
export class NotificationTemplateState implements NgxsOnInit {

  constructor(private store: Store, private service: NotificationTemplateService) { }

  static getOneById(templateId: string) {
    return createSelector([NotificationTemplateState.getItems], (customers: NotificationTemplateModel[]) =>
      customers.find((item) => item.id === templateId)
    );
  }

  @Selector()
  static getDisplayedColumns(state: NotificationTemplateStateModel) {
    return state.displayedColumns;
  }

  @Selector()
  static getItems(state: NotificationTemplateStateModel) {
    return state.items;
  }

  @Selector()
  static getMetadata(state: NotificationTemplateStateModel) {
    return state.meta;
  }

  @Selector()
  static isLoaded(state: NotificationTemplateStateModel) {
    return state.loaded;
  }

  @Selector()
  static isEmpty(state: NotificationTemplateStateModel) {
    return state.loaded && state.items.length === 0;
  }

  @Action(NotificationTemplateActions.GetAll, { cancelUncompleted: true })
  getAll(context: StateContext<NotificationTemplateStateModel>, { query }: NotificationTemplateActions.GetAll) {

    if (query.status) {
      query.disabled = query.status;
      delete query.status;
    }

    return this.service.getAll(query).pipe(
      tap((res) => {
        context.patchState({ items: res.data, meta: res.meta, loaded: true });
      })
    );
  }

  @Action(NotificationTemplateActions.GetOne)
  getOne(context: StateContext<NotificationTemplateStateModel>, { templateId, languageCode }: NotificationTemplateActions.GetOne) {
    return this.service.getOne(templateId, languageCode).pipe(
      tap((res) => {
        const state = context.getState();
        const itemState = state.items.find((item) => item.id === res.data.id, res.data);

        const updatedItems = itemState
          ? updateItem<NotificationTemplateModel>((item) => item.id === res.data.id, res.data)
          : insertItem<NotificationTemplateModel>(res.data);

        context.setState(patch({ items: updatedItems }));
      })
    );
  }

  @Action(NotificationTemplateActions.UpdateDisplayedColumns)
  updateDisplayedColumns(
    context: StateContext<NotificationTemplateStateModel>,
    { displayedColumns }: NotificationTemplateActions.UpdateDisplayedColumns
  ) {
    context.patchState({ displayedColumns });
    localStorage.setItem('notification-templateColumns', JSON.stringify(displayedColumns));
  }

  @Action(NotificationTemplateActions.EnabledOne)
  enabledOne(context: StateContext<NotificationTemplateStateModel>, { templateId, revision }: NotificationTemplateActions.EnabledOne) {
    return this.service.enable(templateId, { revision }).pipe(
      switchMap(() => this.store.dispatch(new NotificationTemplateActions.GetOne(templateId))),
    );
  }

  @Action(NotificationTemplateActions.DisabledOne)
  disabledOne(context: StateContext<NotificationTemplateStateModel>, { templateId, revision }: NotificationTemplateActions.DisabledOne) {
    return this.service.disable(templateId, { revision }).pipe(
      switchMap(() => this.store.dispatch(new NotificationTemplateActions.GetOne(templateId))),
    );
  }

  @Action(NotificationTemplateActions.CreateOne)
  createOne(context: StateContext<NotificationTemplateStateModel>, { data }: NotificationTemplateActions.CreateOne) {
    return this.service.create(data).pipe(
      tap((res) => {
        const items = append<NotificationTemplateModel>([{ ...res.data }]);
        context.setState(patch({ items }));
      })
    );
  }

  @Action(NotificationTemplateActions.DeleteOne)
  deleteOne(context: StateContext<NotificationTemplateStateModel>, { templateId, revision }: NotificationTemplateActions.DeleteOne) {
    return this.service.delete(templateId, { revision }).pipe(
      tap(() => {
        const state = context.getState();
        const updateData = removeItem<NotificationTemplateModel>(state.items.findIndex((item) => item.id === templateId));
        context.setState(patch({ items: updateData }));
      })
    );
  }

  @Action(NotificationTemplateActions.UpdateOne)
  updateOne(
    context: StateContext<NotificationTemplateStateModel>,
    { templateId, revision, patchData }: NotificationTemplateActions.UpdateOne
  ) {
    return this.service.update(templateId, { revision }, patchData).pipe(
      tap((res) => {

        if (!res.data) {
          return;
        }
        const state = context.getState();
        const itemState = state.items.find((item) => item.id === res.data.id, res.data);

        const updateData = itemState
          ? updateItem<NotificationTemplateModel>((item) => item.id === res.data.id, res.data)
          : insertItem<NotificationTemplateModel>(res.data);

        context.setState(patch({ items: updateData }));
      })
    );
  }

  ngxsOnInit(context: StateContext<NotificationTemplateStateModel>) {
    const columnString = localStorage.getItem('notification-templateColumns');
    try {
      const columns = columnString ? JSON.parse(columnString) : displayedColumnSetting.map((column) => column.name);
      context.patchState({ displayedColumns: columns });
    } catch (e) {
      console.error(e);
    }
  }
}
