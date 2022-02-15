import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CronService } from '@api';
import { DataServiceMetadata, Schedule } from '@api/models';
import { Select, Store } from '@ngxs/store';

import { ScheduledAddComponent } from './add/add.component';
import { ScheduledJobsAction } from './scheduled-jobs.actions';
import { ScheduledJobsState } from './scheduled-jobs.state';

@Component({
  selector: 'app-scheduled-jobs',
  templateUrl: './scheduled-jobs.component.html',
  styleUrls: ['./scheduled-jobs.component.less']
})
export class ScheduledJobsComponent implements OnInit, OnDestroy {

  /** 是否加载过至少一次，用于显示骨架屏 */
  @Select(ScheduledJobsState.isLoaded) loaded$: Observable<boolean>;

  @Select(ScheduledJobsState.isEmpty) empty$: Observable<boolean>;

  /** 当前页面列表的分页数据 */
  @Select(ScheduledJobsState.getMetadata) meta$: Observable<DataServiceMetadata>;

  /** 定时任务 */
  @Select(ScheduledJobsState.getScheduledJobs) items$: Observable<Schedule[]>;

  loading = false;

  refreshing = false;

  currentQueryParams: { scheduledJobCode?: string; pageNo?: number } = {};

  scheduledJobCode = '';

  statusMap = {
    finished: '已结束',
    processing: '已开始',
    pending: '未开始'
  };

  private destroy = new Subject();

  private initialQuery = {
    pageNo: 1,
    pageSize: 20,
    sortBy: ['createdAt:desc']
  };

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private message: NzMessageService,
    private cronService: CronService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef
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

        }),
        switchMap((query: { [key: string]: string[] }) =>
          this.store.dispatch(
            new ScheduledJobsAction.GetScheduledJobSchedules(query as { [key: string]: string[] })
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
      .dispatch(new ScheduledJobsAction.GetScheduledJobSchedules(this.currentQueryParams))
      .subscribe(
        () => {
          this.loading = false;
          this.refreshing = false;
        },
        error => {
          this.message.create('error', error.error.message);
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
        pageNo: this.initialQuery.pageNo
      },
      queryParamsHandling: 'merge'
    });

    if (success === null) {
      this.onRefreshing();
    }

  }

  /**
   * 配置任务
   */
  add() {
    const modal = this.modal.create({
      nzTitle: '新建定时任务',
      nzContent: ScheduledAddComponent,
      nzFooter: null,
      nzViewContainerRef: this.viewContainerRef
    });
    modal.afterClose.subscribe(() => {
      this.store
        .dispatch(new ScheduledJobsAction.GetScheduledJobSchedules(this.currentQueryParams));
    });
  }

  /**
   * 删除定时任务
   */
  delete(item) {
    this.modal.confirm({
      nzTitle: `确定要删除：${item.scheduledJob.scheduledJobName} 吗？`,
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.loading = true;
        this.cronService.deleteScheduledJob(item.scheduledJob.id, item.revision).subscribe(
          response => {
            if (response.success) {
              this.message.create('success', '删除任务成功');
              this.onRefreshing();
            } else {
              this.message.create('error', `删除任务失败，${response.error.message}`);
            }
            this.loading = false;
          },
          error => {
            this.loading = false;
            this.message.create('error', `删除任务失败，${error.message || error.error.message}`);
          }
        );
      },
    });
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
