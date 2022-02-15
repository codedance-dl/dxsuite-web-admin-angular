import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Subject } from 'rxjs';

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryType } from '@api/models';
import { Store } from '@ngxs/store';

import {
  NotificationSubscriptionAddComponent
} from './notification-subscription-add/notification-subscription-add.component';
import { NotificationSubscriptions } from './notification-subscription.actions';

@Component({
  selector: 'app-notification-subscription',
  templateUrl: './notification-subscription.component.html',
  styleUrls: ['./notification-subscription.component.less']
})
export class NotificationSubscriptionComponent {

  tabset = [
    {
      name: '商户通知',
      path: 'tenant'
    },
  ];

  categoryType = Object.assign({}, CategoryType);
  category: string;

  private destory = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private drawerService: NzDrawerService
  ) {
    if (this.route.snapshot.children[0].data.type) {
      this.category = this.route.snapshot.children[0].data.type as string;
    }
  }

  openAddDrawer() {
    const drawerRef = this.drawerService.create<NotificationSubscriptionAddComponent, {category: string; value: string}, string>({
      nzTitle: '新建接收项',
      nzContent: NotificationSubscriptionAddComponent,
      nzContentParams: {
        value: this.category,
        category: this.category
      },
      nzClosable: false,
      nzWidth: '580px',
      nzBodyStyle: {
        'overflow-x': 'hidden',
        'overflow-y': 'auto',
        padding: '1rem 24px'
      }
    });

    drawerRef.afterClose.subscribe(data => {
      if (data) {
        this.store.dispatch(new NotificationSubscriptions.GetTemplateTrees());
      }
    });
  }

  changeTab(routeParam) {
    this.router.navigate([routeParam], {
      relativeTo: this.route.parent
    });
    this.category = this.route.snapshot.children[0].data.type as string;
  }

}
