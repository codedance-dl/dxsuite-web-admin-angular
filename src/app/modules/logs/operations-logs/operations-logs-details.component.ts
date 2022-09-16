import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';

import { ResponseLogsModel } from '@constant/common';
import { OperationsLogsState } from '../state/operations-logs.state';

@Component({
  selector: 'app-operations-logs-details',
  templateUrl: './operations-logs-details.component.html',
  styleUrls: ['./operations-logs-details.component.less']
})
export class OperationsLogsDetailsComponent implements OnInit, OnDestroy {

  @Select(OperationsLogsState.isLoaded) loaded$: Observable<boolean>;

  loading = false;

  auditId = this.route.snapshot.params.auditId;

  details: ResponseLogsModel;

  successMap = {
    true: '成功',
    false: '失败'
  };

  private destroy = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    // 获取审计详情（用户获取）
    this.getDetails();
  }

  /**
   * 获取审计详情（用户获取）
   */
  getDetails() {
    this.loading = true;
    this.store.select(OperationsLogsState.getOneById(this.auditId))
      .pipe(takeUntil(this.destroy))
      .subscribe(
        (response: ResponseLogsModel) => {
          this.details = response;
          this.loading = false;
        },
        error => {
          this.loading = false;
          this.message.create('error', error.error.message);
        }
      );
  }

  get getSuccessStatus(): string {
    return this.details.success as string;
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
