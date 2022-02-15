/* eslint-disable @typescript-eslint/naming-convention */
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestQueryParams } from '@api/models';
import { Select, Store } from '@ngxs/store';

import {
  NotificationTemplateModel,
  NotificationTemplateStatusColorMap,
  NotificationTemplateStatusMap
} from './data/notification-template.model';
import { NotificationTemplateActions } from './notification-template.actions';
import { DataServiceMetadata, NotificationTemplateState } from './notification-template.state';

@Component({
  selector: 'notification-template',
  templateUrl: './notification-template.component.html',
  styleUrls: ['./notification-template.component.less']
})
export class NotificationTemplateComponent implements OnInit, OnDestroy {

  @Select(NotificationTemplateState.isLoaded) loaded$: Observable<boolean>;

  @Select(NotificationTemplateState.isEmpty) empty$: Observable<boolean>;

  /** 列表数据 */
  @Select(NotificationTemplateState.getItems) items$: Observable<NotificationTemplateModel[]>;

  /** 当前页面列表的分页数据 */
  @Select(NotificationTemplateState.getMetadata) meta$: Observable<DataServiceMetadata>;

  @Select(NotificationTemplateState.getDisplayedColumns) displayedColumns$: Observable<string[]>;

  name: string;

  loading = false;

  ERROR_CODE = 'error.no-privilege';

  ERROR_MESSAGE = '当前用户没有编辑权限';

  currentQueryParams = null;

  statusMap = NotificationTemplateStatusMap;

  statusColorMap = NotificationTemplateStatusColorMap;

  disabledOptions: {
    text: string;
    value: string;
  }[] = [
      { text: '启用', value: 'false' },
      { text: '停用', value: 'true' }
    ];

  private initialQuery = {
    pageNo: 1,
    pageSize: 20
  };

  private destroy = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private nzMessageService: NzMessageService,
    private modal: NzModalService
  ) { }

  ngOnInit() {

    this.route.queryParams
      .pipe(
        map((params) => this.mergeQueryParams(params)),
        tap((params) => {
          this.loading = true;
          this.currentQueryParams = params;
          if (params.name) {
            this.name = params.name;
          }
        }),
        switchMap((query: RequestQueryParams | void) =>
          this.store.dispatch(new NotificationTemplateActions.GetAll(query as RequestQueryParams))),
        takeUntil(this.destroy)
      )
      .subscribe(() => {
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  /**
   * 查询
   */
  async onSearch() {
    // 查询条件
    this.currentQueryParams.name = this.name || null;
    this.currentQueryParams.pageNo = this.initialQuery.pageNo;

    const success = await this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { ...this.currentQueryParams },
      queryParamsHandling: 'merge'
    });

    if (success === null) {
      await this.onRefreshing();
    }

  }

  /**
   * 刷新
   */
  async onRefreshing() {
    this.loading = true;
    this.store.dispatch(new NotificationTemplateActions.GetAll(this.mergeQueryParams(this.route.snapshot.queryParams))).subscribe(() => {
      this.loading = false;
    });
  }

  onClickRemove(item: NotificationTemplateModel) {
    this.modal.confirm({
      nzTitle: `确定要删除：${item.name} 吗？`,
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.store.dispatch(new NotificationTemplateActions.DeleteOne(item.id, item.revision)).subscribe(
          () => {
            this.nzMessageService.success('删除成功');
          },
          (error) => {
            this.nzMessageService.error(error.error.code === this.ERROR_CODE ? this.ERROR_MESSAGE : error.error.message);
          }
        );
      },
      nzCancelText: '取消'
    });
  }

  onClickToggleDisable(item: NotificationTemplateModel, status: string) {

    this.modal.confirm({
      nzTitle: `确定要${status === 'false' ? '停用' : '启用'}：${item.name} 吗？`,
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOnOk: () => {
        if (status === 'false') {
          this.store.dispatch(new NotificationTemplateActions.DisabledOne(item.id, item.revision)).subscribe(
            () => {
              this.nzMessageService.success('停用成功');
            },
            (error) => this.nzMessageService.error(error.error.code === this.ERROR_CODE ? this.ERROR_MESSAGE : error.error.message)
          );
          return;
        }
        this.store.dispatch(new NotificationTemplateActions.EnabledOne(item.id, item.revision)).subscribe(
          () => {
            this.nzMessageService.success('启用成功');
          },
          (error) => this.nzMessageService.error(error.error.code === this.ERROR_CODE ? this.ERROR_MESSAGE : error.error.message)
        );
      },
      nzCancelText: '取消'
    });
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
