import { filter, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngxs/store';

import { NotificationTemplateModel } from './data/notification-template.model';
import { NotificationTemplateActions } from './notification-template.actions';

@Injectable()
export class NotificationTemplateResolve implements Resolve<NotificationTemplateModel> {

  constructor(private store: Store) { }

  resolve(route: ActivatedRouteSnapshot) {

    const templateId = route.params.templateId;

    return this.store.dispatch(new NotificationTemplateActions.GetOne(templateId)).pipe(
      filter(res => !!res),
      take(1)
    );
  }
}
