import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';

import { TemplateHierarchy } from './data/notification-subscription';
import { CHANNEL_SWITCH_TYPE_MAP } from './notifation-model';
import {
  NotificationSubscriptionEditComponent
} from './notification-subscription-edit/notification-subscription-edit.component';
import { NotificationSubscriptions } from './notification-subscription.actions';
import { NotificationSubscriptionState } from './notification-subscription.state';

@Component({
  selector: 'app-notification-subscription-tenant',
  templateUrl: './notification-subscription-tenant.component.html',
  styleUrls: ['./notification-subscription-tenant.component.less'],
})
export class NotificationSubscriptionTenantComponent implements OnInit {
  @Select(NotificationSubscriptionState.templateTrees)
  templateHierarchy$: Observable<TemplateHierarchy[]>;
  items = [];

  dataSource = [];
  loading = false;

  groupId: string;
  templateId: string;

  groupName = new FormControl(null, [Validators.required]);
  channelSwitches = Object.keys(CHANNEL_SWITCH_TYPE_MAP);

  constructor(
    private store: Store,
    private nzMessageService: NzMessageService,
    private drawerService: NzDrawerService,
    private modal: NzModalService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.store.dispatch(new NotificationSubscriptions.GetTemplateTrees()).subscribe(
      () => {
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  templateGroup = (data) => data.type && data.type === 'item-group';

  setShowItems(group) {
    this.store.dispatch(new NotificationSubscriptions.ChangeFoldStatus(group.id || ''));
  }


  showDeleteConfirm(item): void {
    this.modal.confirm({
      nzTitle: `确定要删除：${item.name} 吗？`,
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.onDelete(item),
      nzCancelText: '取消'
    });
  }

  onDelete(item) {
    this.loading = true;
    this.store.dispatch(new NotificationSubscriptions.Delete(item.id, item.revision, item.parentId)).subscribe(
      () => {
        this.loading = false;
        this.nzMessageService.success(`删除 ${item.name} 成功`);
      },
      (error) => {
        this.loading = false;
        this.nzMessageService.error(`删除失败 ${error.error.code === 'error.no-privilege' ? '当前用户没有编辑权限' : error.error.message}`);
      }
    );
  }

  openEditDrawer(item) {
    const drawerRef = this.drawerService.create<NotificationSubscriptionEditComponent, { templateId: string; category: string }>({
      nzTitle: `编辑接收项（${item.name}）`,
      nzContent: NotificationSubscriptionEditComponent,
      nzContentParams: {
        templateId: item.id,
        category: 'TENANT'
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

  distinctionTooltip(disabled, editable) {
    const target_name = this.channelSwitches.find(name => {
      const item = CHANNEL_SWITCH_TYPE_MAP[name];
      if (item.disabled === disabled && item.editable === editable) {
        return true;
      } else {
        return false;
      }
    });
    return CHANNEL_SWITCH_TYPE_MAP[target_name].text;
  }
}
