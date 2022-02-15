import { switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { MessageModel } from '@api/models';
import { Store } from '@ngxs/store';

import { MessageUnreadActions } from '../message-unread.actions';
import { MessageUnreadState } from '../message-unread.state';

@Injectable()
export class MessageUnreadDetailsResolve implements Resolve<MessageModel> {

  constructor(private store: Store) { }

  resolve(route: ActivatedRouteSnapshot) {
    const messageId = route.params.messageId;
    return this.store.dispatch(new MessageUnreadActions.GetOne(messageId))
      .pipe(switchMap(() => this.store.selectOnce(MessageUnreadState.getOneById(messageId))));
  }
}
