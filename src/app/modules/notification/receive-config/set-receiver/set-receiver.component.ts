import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EmployeesService, NotificationSubscriptionService } from '@api';
import { Store } from '@ngxs/store';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-set-receiver',
  templateUrl: './set-receiver.component.html',
  styleUrls: ['./set-receiver.component.less']
})
export class SetReceiverComponent implements OnInit, OnDestroy {

  @Input()
  set item(value) {
    if (value) {
      this._item = value;
    }
  }
  get item() {
    return this._item;
  }

  @Input()
  set receivers(value) {
    if (!!value && value.length && value.length > 0) {
      this._receivers = value;
    }
  }
  get receivers() {
    return this._receivers;
  }

  @Input()
  set receiversShow(value) {
    if (!!value && value.length && value.length > 0) {
      this._receiversShow = value;
    }
  }
  get receiversShow() {
    return this._receiversShow;
  }

  @Output() confirm = new EventEmitter<null>();

  employees = [];

  keyword: string;

  loading = false;

  form: FormGroup;

  orgId: string;

  _item: {
    id?: string;
    revision?: number;
  };

  _receivers = [];

  _receiversShow = [];

  selectedEmployees = [];

  selectedUsers = [];

  private _destroy = new Subject();

  constructor(
    private notificationSubscriptionService: NotificationSubscriptionService,
    private tenantEmployeeService: EmployeesService,
    private message: NzMessageService,
    private store: Store
  ) {}

  ngOnInit() {
    this.keyword = '';
    this.orgId = environment.orgId;
    this.selectedUsers = this._receivers.map((i) => i.id);
    this.selectedEmployees = this._receiversShow.map((i) => i.id);
    this.searchEmployee();
  }

  searchEmployee() {
    const query: {keyword?: string} = {};
    query.keyword = this.keyword || null;
    this.tenantEmployeeService.search(this.orgId, query).subscribe((result) => {
      this.employees = result.data.filter((i) => !this._receivers.some((r) => i.id === r.id));
    });
  }

  clearSelectedEmployees(opened: boolean) {
    if (!opened) {
      return;
    }
    this.selectedEmployees = [];
    this.keyword = '';
    this.searchEmployee();
  }

  selectEmployee($event, employeeId: string, userId: string) {
    if ($event.checked) {
      this.selectedEmployees.push(employeeId);
      this.selectedUsers.push(userId);
    } else {
      this.selectedEmployees = this.selectedEmployees.filter((i) => i !== employeeId);
      this.selectedUsers = this.selectedUsers.filter((i) => i !== userId);
    }
  }

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
  }

  removeReceiver(employeeId: string, userId: string) {
    if (this._receivers.length < 2) {
      this.message.warning('最少需要设置1位通知接收人');
      return;
    }

    this.notificationSubscriptionService
      .setTenantReceivers(
        this._item.id,
        this._item.revision,
        this._receivers.filter((r) => r.id !== userId).map((r) => r.id) as [string],
        this._receiversShow.filter((r) => r.id !== employeeId).map((r) => r.id) as [string]
      )
      .subscribe(() => {
        this.confirm.next();
      });
  }

  setReceivers(employeeId: string, userId: string) {
    this.notificationSubscriptionService
      .setTenantReceivers(
        this._item.id,
        this._item.revision,
        this.selectedUsers.filter((item) => userId !== item).concat(userId) as [string],
        this.selectedEmployees.filter((item) => employeeId !== item).concat(employeeId) as [string]
      )
      .subscribe(() => {
        this.confirm.next();
      });
  }
}
