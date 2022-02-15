/* eslint-disable @typescript-eslint/naming-convention */
import { of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { NotificationSubscriptionService } from '@api';
import { environment } from '@environments/environment';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { NotificationSubscriptionTrees, TemplateHierarchy } from './data/notification-subscription';
import { NotificationSubscriptions } from './notification-subscription.actions';

export interface NotificationSubscriptionSetStateModel {
  templateHierarchy?: TemplateHierarchy[];
  // templateFlatten?: any;
  itemsHierarchy?: NotificationSubscriptionTrees[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templateTrees?: any[];
  loading: boolean;
  loaded: boolean;
}

const initialState = (): NotificationSubscriptionSetStateModel => ({
  templateHierarchy: [],
  itemsHierarchy: [],
  templateTrees: [],
  loading: true,
  loaded: false
});

const flattenHierarchy = (data) => {
  const newData = [];
  data.forEach((group) => {
    newData.push({
      id: '',
      text: '',
      ...group.businessGroup,
      ...group,
      type: 'item-group',
      fold: false
    });
    (group.subscriptions || []).forEach((item) => {
      newData.push({ ...item, parentId: (group.businessGroup || {}).id || '' });
    });
  });
  return newData;
};

@State<NotificationSubscriptionSetStateModel>({
  name: 'NotificationSubscriptionSet',
  defaults: initialState()
})
@Injectable()
export class NotificationSubscriptionState {
  constructor(private notificationSubscriptionService: NotificationSubscriptionService, private store: Store) {}

  @Selector()
  static loading(state: NotificationSubscriptionSetStateModel) {
    return state.loading;
  }

  @Selector()
  static loaded(state: NotificationSubscriptionSetStateModel) {
    return state.loaded;
  }

  @Selector()
  static templateHierarchy(state: NotificationSubscriptionSetStateModel) {
    return state.templateHierarchy;
  }

  @Selector()
  static templateTrees(state: NotificationSubscriptionSetStateModel) {
    return state.templateTrees;
  }

  @Selector()
  static itemsHierarchy(state: NotificationSubscriptionSetStateModel) {
    return state.itemsHierarchy;
  }

  @Action(NotificationSubscriptions.Hierarchy)
  getTemplateHierarchy(context: StateContext<NotificationSubscriptionSetStateModel>, { category }: NotificationSubscriptions.Hierarchy) {
    return this.notificationSubscriptionService.getTemplateHierarchy({ category }).pipe(
      tap((result) => {
        const state = context.getState();
        context.setState({
          ...state,
          templateHierarchy: flattenHierarchy(result.data)
        });
      })
    );
  }

  @Action(NotificationSubscriptions.GetTemplateTrees)
  GetTemplateTrees(context: StateContext<NotificationSubscriptionSetStateModel>) {
    return this.notificationSubscriptionService.getTemplateTrees().pipe(
      tap((result) => {
        const state = context.getState();
        context.setState({
          ...state,
          templateTrees: flattenHierarchy(result.data)
        });
      })
    );
  }

  @Action(NotificationSubscriptions.Create)
  createTemplate(
    context: StateContext<NotificationSubscriptionSetStateModel>,
    { submitData, groupName }: NotificationSubscriptions.Create
  ) {
    return this.notificationSubscriptionService.create(submitData).pipe(
      tap(({ data }) => {
        const templateTrees = [...context.getState().templateTrees]
          .filter((item) => item.parentId !== data.businessGroup.id)
          .map((node) => ({ ...node }));

        const index = templateTrees.findIndex((group) => group.id === data.businessGroup.id);
        if (index === -1) {
          // 新建分组
          templateTrees.push(
            ...flattenHierarchy([
              {
                id: data.businessGroup.id,
                name: groupName,
                subscriptions: [data]
              }
            ])
          );
        } else {
          // 已存在分组
          const update = {
            ...templateTrees[index],
            subscriptions: [...templateTrees[index].subscriptions, data]
          };
          templateTrees.splice(index, 1, ...flattenHierarchy([update]));
        }
        context.setState(patch({ templateTrees }));
      })
    );
  }

  @Action(NotificationSubscriptions.ChangeFoldStatus)
  changeFoldStatus(context: StateContext<NotificationSubscriptionSetStateModel>, { groupId }: NotificationSubscriptions.ChangeFoldStatus) {
    const newHierarchy = [...context.getState().templateTrees].filter((item) => item.parentId !== groupId).map((node) => ({ ...node }));
    const update = newHierarchy.find((group) => group.id === groupId);
    const index = newHierarchy.findIndex((group) => group.id === groupId);
    if (update.fold) {
      // 当前状态为已折叠
      newHierarchy.splice(index, 1, ...flattenHierarchy([update]));
    } else {
      // 当前状态为未折叠
      update.fold = !update.fold;
    }
    context.setState(patch({ templateTrees: newHierarchy }));
  }

  @Action(NotificationSubscriptions.Update)
  updateTemplate(
    context: StateContext<NotificationSubscriptionSetStateModel>,
    { submitData, revision, templateId }: NotificationSubscriptions.Update
  ) {
    return this.notificationSubscriptionService.update(templateId, revision, submitData).pipe(
      switchMap(() => this.notificationSubscriptionService.detail(templateId)),
      tap(({ data }) => {
        const templateTrees = [...context.getState().templateTrees]
          .filter((item) => item.parentId !== data.businessGroup.id)
          .map((node) => ({ ...node }));
        const index = templateTrees.findIndex((group) => group.id === data.businessGroup.id);
        const update = {
          ...templateTrees[index],
          // eslint-disable-next-line no-extra-parens
          subscriptions: templateTrees[index].subscriptions.map((item) => (item.id === templateId ? data : item))
        };
        templateTrees.splice(index, 1, ...flattenHierarchy([update]));
        context.setState(patch({ templateTrees }));
      })
    );
  }

  @Action(NotificationSubscriptions.Delete)
  deleteTemplate(
    context: StateContext<NotificationSubscriptionSetStateModel>,
    { revision, templateId, groupId }: NotificationSubscriptions.Delete
  ) {
    return this.notificationSubscriptionService.delete(templateId, revision).pipe(
      tap(() => {
        const templateTrees = [...context.getState().templateTrees]
          .filter((item) => item.parentId !== groupId)
          .map((node) => ({ ...node }));

        const index = templateTrees.findIndex((group) => group.id === groupId);

        const update = {
          ...templateTrees[index],
          subscriptions: templateTrees[index].subscriptions.filter((item) => item.id !== templateId)
        };

        if (update.subscriptions && update.subscriptions.length > 0) {
          templateTrees.splice(index, 1, ...flattenHierarchy([update]));
        } else {
          templateTrees.splice(index, 1);
        }

        context.setState(patch({ templateTrees }));
      })
    );
  }

  @Action(NotificationSubscriptions.GetItemsHierarchy)
  getItemsHierarchy(context: StateContext<NotificationSubscriptionSetStateModel>) {
    const orgId = environment.orgId;
    return this.notificationSubscriptionService.getTenantNotificationSubscriptions(orgId).pipe(
      tap((result) => {
        const state = context.getState();
        context.setState({ ...state, itemsHierarchy: result.data || [] });
      }),
      catchError((error) => of(error))
    );
  }
}
