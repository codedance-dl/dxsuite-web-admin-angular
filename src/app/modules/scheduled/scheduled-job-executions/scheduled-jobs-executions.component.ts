import { NzMessageService } from 'ng-zorro-antd/message';
/* eslint-disable @typescript-eslint/naming-convention */
import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataServiceMetadata, Schedule, ScheduledJobsQuery } from '@api/models';
import { Select, Store } from '@ngxs/store';

import { ScheduledJobExecutionsAction } from './scheduled-jobs-executions.actions';
import { ScheduledJobExecutionsState } from './scheduled-jobs-executions.state';

@Component({
  selector: 'app-scheduled-jobs',
  templateUrl: './scheduled-jobs-executions.component.html',
  styleUrls: ['./scheduled-jobs-executions.component.less']
})
export class ScheduledJobExecutionsComponent implements OnInit, OnDestroy {

  /** 是否加载过至少一次，用于显示骨架屏 */
  @Select(ScheduledJobExecutionsState.isLoaded) loaded$: Observable<boolean>;

  @Select(ScheduledJobExecutionsState.isEmpty) empty$: Observable<boolean>;

  /** 当前页面列表的分页数据 */
  @Select(ScheduledJobExecutionsState.getMetadata) meta$: Observable<DataServiceMetadata>;

  /** 定时任务 */
  @Select(ScheduledJobExecutionsState.getScheduledJobExecutions) items$: Observable<Schedule[]>;

  loading = false;

  refreshing = false;

  currentQueryParams: ScheduledJobsQuery = {};


  scheduledJobCode = '';

  status = '';

  statusMap = {
    PENDING: 'PENDING',
    READY: 'READY',
    PROCESSING: 'PROCESSING',
    CANCELLING: 'CANCELLING',
    CANCELLED: 'CANCELLED',
    FAILED: 'FAILED',
    FINISHED: 'FINISHED'
  };

  statusArray = [
    { key: 'PENDING', value: 'PENDING' },
    { key: 'READY', value: 'READY' },
    { key: 'PROCESSING', value: 'PROCESSING' },
    { key: 'CANCELLING', value: 'CANCELLING' },
    { key: 'CANCELLED', value: 'CANCELLED' },
    { key: 'FAILED', value: 'FAILED' },
    { key: 'FINISHED', value: 'FINISHED' }
  ];

  private destroy = new Subject();

  private initialQuery = {
    pageNo: 1,
    pageSize: 20,
    sortBy: ['startedAt:desc']
  };

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private message: NzMessageService
  ) {

  }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        map((params) => this.mergeQueryParams(params)),
        tap((params) => {
          this.loading = true;
          this.currentQueryParams = { ...params };

          if (params.scheduledJobCode) {
            this.scheduledJobCode = params.scheduledJobCode;
          }

          if (params.status) {
            this.status = params.status;
          }

        }),
        switchMap((query: { [key: string]: string[] }) =>
          this.store.dispatch(
            new ScheduledJobExecutionsAction.GetScheduledJobExecutions(query as { [key: string]: string[] })
          )),
        takeUntil(this.destroy)
      )
      .subscribe(() => {
        this.loading = false;
      });
  }

  onRefreshing() {
    this.loading = true;
    this.refreshing = true;
    this.store
      .dispatch(new ScheduledJobExecutionsAction.GetScheduledJobExecutions(this.currentQueryParams))
      .subscribe(
        () => {
          this.loading = false;
          this.refreshing = false;
        },
        error => {
          this.message.create(`error`, error.error.message);
          this.loading = false;
          this.refreshing = false;
        }
      );
  }

  /**
   * 查询
   */
  async onSearch() {
    const success = await this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: {
        ...this.currentQueryParams,
        scheduledJobCode: this.scheduledJobCode || null,
        status: this.status || null,
        pageNo: this.initialQuery.pageNo
      },
      queryParamsHandling: 'merge'
    });

    if (success === null) {
      this.onRefreshing();
    }

  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  /**
   * 分页方法
   */
  onPageChange(pageNo: number) {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { pageNo },
      queryParamsHandling: 'merge'
    });
  }

  /**
   * 每页条数改变
   */
  onPageSizeChange(pageSize) {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: {
        pageSize,
        pageNo: 1
      },
      queryParamsHandling: 'merge'
    });
  }

  private mergeQueryParams(queryParams) {
    const newQueryParams = { ...this.initialQuery, ...queryParams };
    const pageNo = coerceNumberProperty(queryParams.pageNo, newQueryParams.pageNo);
    const pageSize = coerceNumberProperty(queryParams.pageSize, newQueryParams.pageSize);
    newQueryParams.pageNo = pageNo;
    newQueryParams.pageSize = pageSize;
    return newQueryParams;
  }
}
