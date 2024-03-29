import { switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { MessageModel } from '@api/models';
import { Store } from '@ngxs/store';

import { I18nMessageActions } from '../message.actions';
import { I18nMessageState } from '../message.state';

@Injectable()
export class MessageDetailsResolve implements Resolve<MessageModel> {

  constructor(private store: Store) { }

  resolve(route: ActivatedRouteSnapshot) {
    const messageId = route.params.messageId;
    return this.store.dispatch(new I18nMessageActions.GetOne(messageId))
      .pipe(switchMap(() => this.store.selectOnce(I18nMessageState.getOneById(messageId))));
  }
}