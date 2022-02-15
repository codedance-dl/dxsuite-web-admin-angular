import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { NotificationSubscriptionService } from '@api';
import {
  NotificationSubscriptionTrees
} from '@app/modules/notification-subscription/data/notification-subscription';
import {
  NotificationSubscriptions
} from '@app/modules/notification-subscription/notification-subscription.actions';
import {
  NotificationSubscriptionState
} from '@app/modules/notification-subscription/notification-subscription.state';
import { Select, Store } from '@ngxs/store';

@Component({
  selector: 'app-receive-config',
  templateUrl: './receive-config.component.html',
  styleUrls: ['./receive-config.component.less'],
})
export class ReceiveConfigComponent implements OnInit {
  @Select(NotificationSubscriptionState.itemsHierarchy) itemsHierarchy$: Observable<NotificationSubscriptionTrees[]>;
  loading = false;
  itemsHierarchy: NotificationSubscriptionTrees[];
  constructor(
    private store: Store,
    private message: NzMessageService,
    private notificationSubscriptionService: NotificationSubscriptionService
  ) { }

  ngOnInit() {
    this.store.dispatch(new NotificationSubscriptions.GetItemsHierarchy());
  }

  channelSwitchChange($event, id, mode, revision) {
    let action = '';
    if (mode === 'sms') {
      action = $event ? 'enable-sms' : 'disable-sms';
    }

    if (mode === 'message') {
      action = $event ? 'enable-msg' : 'disable-msg';
    }

    if (mode === 'mail') {
      action = $event ? 'enable-mail' : 'disable-mail';
    }

    this.loading = true;
    this.notificationSubscriptionService
      .setSwitches(id, revision, action)
      .subscribe(() => {
        this.store.dispatch(new NotificationSubscriptions.GetItemsHierarchy()).subscribe(() => this.loading = false);
      },
      (error)=> {
        this.loading = false;
        this.message.error(error && error.error && (error.error.message || error.error.code));
      });
  }

  reload() {
    this.loading = true;
    this.store.dispatch(new NotificationSubscriptions.GetItemsHierarchy()).subscribe(() => this.loading = false);
  }

}
