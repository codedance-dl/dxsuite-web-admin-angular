import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetsService } from '@api/assets.service';
import { AssetModel, User } from '@api/models';
import { AuthState } from '@app/store';
import { environment } from '@environments/environment';
import { Select, Store } from '@ngxs/store';

import { AssetsActions } from './assets.actions';
import { AssetsState, DataServiceMetadata } from './assets.state';

@Component({
  templateUrl: './assets.component.html'
})
export class AssetsComponent implements OnInit, OnDestroy {

  @Select(AssetsState.isLoaded) loaded$: Observable<boolean>;

  @Select(AssetsState.isEmpty) empty$: Observable<boolean>;

  @Select(AssetsState.getItems) items$: Observable<AssetModel[]>;

  @Select(AssetsState.getMetadata) meta$: Observable<DataServiceMetadata>;

  @Select(AssetsState.getDisplayedColumns) displayedColumns$: Observable<string[]>;

  orgId: string;

  user: User;

  host = environment.host;

  keyword: string;

  loading = false;

  preKeyword = '';

  inputting = false;

  refreshing = false;

  currentQueryParams = null;

  uploadUrl: string;

  private destroy = new Subject();

  private initialQuery = {
    pageNo: 1,
    pageSize: 20,
    sortBy: ['code:asc', 'createdAt:desc']
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private assetsService: AssetsService,
    private message: NzMessageService
  ) {
    this.user = this.store.selectSnapshot(AuthState.getIdentity);
    this.orgId = environment.orgId;
    this.uploadUrl = `${this.host}/api/v1/tenants/${this.orgId}/import-assets`;
  }

  ngOnInit() {

    this.route.queryParams
      .pipe(
        map(params => this.mergeQueryParams(params)),
        tap(params => {
          this.loading = true;
          this.currentQueryParams = params;
          delete this.currentQueryParams.name;
        }),
        switchMap(query => this.store.dispatch(new AssetsActions.GetAll(query)))
      )
      .subscribe(() => {
        this.loading = false;
        delete this.currentQueryParams.name;
        this.cacheUpdatedQueryParams();
      });

  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
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
      .dispatch(new AssetsActions.GetAll(this.currentQueryParams))
      .subscribe(() => this.refreshing = false);
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

  async onSearch() {
    // 查询条件
    this.currentQueryParams.keyword = this.keyword || null;
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

  clearKeyword(event: Event) {
    this.keyword = '';
    this.onSearch();
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
    this.keyword = keyword;
  }

  downloadTemplate() {
    this.loading = true;
    this.assetsService.downloadTemplate(this.orgId).subscribe(
      (res: Blob) => {
        // 创建a标签
        const link = document.createElement('a');
        // 解析返回的文件类型
        const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });
        link.style.display = 'none';
        // 文件序列化的过程，将文件转换成可访问的URL（字符串）
        link.href = URL.createObjectURL(blob);
        // 下载的文件名
        link.download = `资产导入模版.xlsx`;
        link.click();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.message.create('error', error?.error && error?.error.message || '导出失败');
      });
  }

  onChange(event: NzUploadChangeParam) {
    if (event.type === 'success') {
      // 跳转导入日志页
      this.message.create('success', '操作成功，数据导入中，请稍后刷新');
      setTimeout(() => {
        this.router.navigate(['/', 'import', 'logs'], { relativeTo: this.route });
      }, 1000);
    } else if (event.type === 'error') {
      // 提示文言：导入失败
      this.message.create('error', event.file.error?.error && event?.file?.error?.error.message || '导入失败');
    }
  }

}
