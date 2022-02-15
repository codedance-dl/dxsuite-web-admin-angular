import * as OSS from 'ali-oss';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DataServiceResult,
  ImportLogsModel,
  IMPORT_LOGS_STATUS_COLOR_MAP,
  IMPORT_LOGS_STATUS_LIST,
  IMPORT_LOGS_STATUS_MAP,
  User
} from '@api/models';
import { TasksService } from '@api/tasks.service';
import { AuthState } from '@app/store';
import { Select, Store } from '@ngxs/store';

import { environment } from '../../../../environments/environment';
import { LogsActions } from './logs.actions';
import { DataServiceMetadata, LogsState } from './logs.state';

@Component({
  selector: 'logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.less']
})

export class LogsComponent implements OnInit, OnDestroy {

  @Select(LogsState.isLoaded) loaded$: Observable<boolean>;

  @Select(LogsState.isEmpty) empty$: Observable<boolean>;

  @Select(LogsState.getItems) items$: Observable<ImportLogsModel[]>;

  @Select(LogsState.getMetadata) meta$: Observable<DataServiceMetadata>;

  @Select(LogsState.getDisplayedColumns) displayedColumns$: Observable<string[]>;

  orgId: string;

  user: User;

  host = environment.host;

  stompClient = null;
  stompSubscription = null;

  keywordControl = new FormControl(this.route.snapshot.queryParams.keyword || '');

  loading = false;

  preKeyword = '';

  inputting = false;

  refreshing = false;

  currentQueryParams = null;

  statusMap = IMPORT_LOGS_STATUS_MAP;
  statusList = IMPORT_LOGS_STATUS_LIST;
  statusColorMap = IMPORT_LOGS_STATUS_COLOR_MAP;

  private destroy = new Subject();

  private search = new Subject<string>();

  private initialQuery = {
    pageNo: 1,
    pageSize: 20,
    sortBy: ['createdAt:desc']
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private tasksService: TasksService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {

    this.user = this.store.selectSnapshot(AuthState.getIdentity);
    this.orgId = environment.orgId;

    if (!this.stompClient) {
      // 创建 STOMP 客户端
      this.stompClient = Stomp.over(new SockJS(`${this.host}/stomp`));
      this.stompClient.reconnect_delay = 5000;

      // 连接服务器并订阅指定用户的导入任务消息
      this.stompClient.connect({}, () => {
        this.subscribe();
      });
    }
  }

  ngOnInit() {

    this.route.queryParams
      .pipe(
        map(params => this.mergeQueryParams(params)),
        tap(params => {
          this.loading = true;
          this.currentQueryParams = params;
        }),
        switchMap(query => this.store.dispatch(new LogsActions.GetAll(query))),
      )
      .subscribe(() => {
        this.loading = false;
        this.cacheUpdatedQueryParams();
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
    if (this.stompSubscription) {
      this.stompSubscription.unsubscribe();
    }
  }

  async onSearch() {
    // 查询条件
    this.currentQueryParams.pageNo = this.initialQuery.pageNo;

    const success = await this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { ...this.currentQueryParams },
      queryParamsHandling: 'merge'
    });

    if (success === null) {
      this.onRefreshing();
    }

  }

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

  getProcess(current, total) {
    return Math.ceil(current * 100 / total);
  }

  subscribe() {
    // 若已订阅则取消订阅
    if (this.stompSubscription) {
      this.stompSubscription.unsubscribe();
    }

    // 订阅导入结果
    this.stompSubscription = this.stompClient.subscribe(`/topic/import-assets.${this.user.id}`, frame => {
      if (frame?.body) {
        const result = JSON.parse(frame.body);
        if (result.taskId) {
          this.store.dispatch(new LogsActions.UpdateImportProcess(result.taskId, result));
        }
      }
    });
  }

  /**
   * 终止任务
   */
  stopTask(itemId: string) {
    this.modal.confirm({
      nzTitle: `确定要终止任务吗？`,
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.loading = true;
        this.tasksService.stopOne(this.orgId, itemId).subscribe(
          response => {
            if (response.success) {
              this.message.create('success', '终止成功');
              this.onRefreshing();
            }
            this.loading = false;
          },
          error => {
            this.loading = false;
            this.message.create('error', error.error && error.error.message || '终止失败');
          }
        );
      },
      nzCancelText: '取消',
    });
  }

  /**
   * 下载文件
   */
  download(item) {
    this.tasksService.downloadResult(this.orgId, item.id).subscribe(
      (res: DataServiceResult) => {
        if (res.success) {
          const client = new OSS({
            // endpoint: 'oss-cn-beijing.aliyuncs.com',
            region: 'oss-cn-beijing',
            accessKeyId: res.data.credentials.accessKeyId,
            accessKeySecret: res.data.credentials.accessKeySecret,
            bucket: 'dxsuite-import-files'
            // stsToken: res.data.credentials.securityToken
          });
          // 配置响应头实现通过URL访问时自动下载文件，并设置下载后的文件名。
          const filename = item.importFileName; // filename为自定义下载后的文件名。
          const downloadUrl = client.signatureUrl(filename, {
            'content-disposition': `attachment; filename=${encodeURIComponent(filename)}`
          });
          // 创建a标签
          const link = document.createElement('a');
          link.style.display = 'none';
          // 文件序列化的过程，将文件转换成可访问的URL（字符串）
          link.href = downloadUrl;
          link.click();
        } else {
          this.loading = false;
          this.message.create('error', res.error && res.error.message || '下载失败');
        }
      },
      error => {
        this.loading = false;
        this.message.create('error', error.error && error.error.message || '下载失败');
      }
    );
  }

  getCurrentQueryParams() {
    const queryParams = { ...this.route.snapshot.queryParams };
    const keyword = this.route.snapshot.queryParams.keyword || '';
    if (keyword) {
      queryParams.keyword = keyword;
    }
    const sort = this.route.snapshot.queryParams.sort || '';
    if (sort) {
      queryParams.sort = sort;
    }
    return queryParams;
  }

  onRefreshing() {
    this.refreshing = true;
    this.store
      .dispatch(new LogsActions.GetAll(this.currentQueryParams))
      .subscribe(() =>  this.refreshing = false);
  }

  clearFilterKey(key: string, event: Event) {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { [key]: null, pageNo: null },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
    event.stopPropagation();
  }

  clearAllFilter() {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: null,
      replaceUrl: true
    });
  }

  onEnter() {
    this.search.next(this.keywordControl.value);
  }

  onBlur() {
    this.inputting = false;
    this.keywordControl.setValue(this.preKeyword, { emitEvent: false });
  }

  clearKeyword(event: Event) {
    this.keywordControl.setValue('');
    this.onEnter();
    event.stopPropagation();
  }

  mergeQueryParams(queryParams) {
    const newQueryParams = { ...this.initialQuery, ...queryParams };
    const pageNo = coerceNumberProperty(queryParams.pageNo, newQueryParams.pageNo);
    const pageSize = coerceNumberProperty(queryParams.pageSize, newQueryParams.pageSize);
    newQueryParams.pageNo = pageNo;
    newQueryParams.pageSize = pageSize;

    return newQueryParams;
  }

  cacheUpdatedQueryParams() {
    const { keyword } = this.getCurrentQueryParams();
    this.preKeyword = keyword;
    this.keywordControl.setValue(keyword, { emitEvent: false });
  }

}
