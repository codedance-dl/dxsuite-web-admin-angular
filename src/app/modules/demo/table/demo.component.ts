import { NzTableSortOrder } from 'ng-zorro-antd/table';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataServiceMetadata, RequestQueryParams } from '@api/models';
import { DemoModel } from '@app/modules/demo/table/data/demo.model';
import { Select, Store } from '@ngxs/store';

import { DemoActions } from './state/demo.actions';
import { DemoState } from './state/demo.state';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.less']
})
export class DemoComponent implements OnDestroy {

  @Select(DemoState.isLoaded) loaded$: Observable<boolean>;

  @Select(DemoState.getItems) items$: Observable<DemoModel[]>;

  @Select(DemoState.getMetadata) meta$: Observable<DataServiceMetadata>;

  loading: boolean;

  // 检索条件：操作用户
  user: string;

  // 检索条件：业务操作
  domain: string;

  keyword: string;

  currentQueryParams = null;

  timeStart = null;

  timeEnd = null;

  date = null;

  showMoreFilter: boolean;

  // 操作结果枚举
  statusArray = [
    { key: 'true', value: '成功' },
    { key: 'false', value: '失败' }
  ];

  private destroy = new Subject();

  private initialQuery = {
    pageNo: 1,
    pageSize: 20,
    sortBy: ['time:desc']
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    this.route.queryParams
      .pipe(
        map((params) => this.mergeQueryParams(params)),
        tap((params) => {
          this.loading = true;
          this.currentQueryParams = params;
          if (params.timeStart && params.timeEnd) {
            this.timeStart = params.timeStart ? new Date(params.timeStart) : '';
            this.timeEnd = params.timeEnd ? new Date(params.timeEnd) : '';
            this.date = [this.timeStart, this.timeEnd];
          }
          if (params.keyword) {
            this.keyword = params.keyword;
          }
        }),
        switchMap((query: RequestQueryParams | void) => this.store.dispatch(new DemoActions.GetAll(query as RequestQueryParams))),
        takeUntil(this.destroy)
      )
      .subscribe(() => {
        this.loading = false;
      });
  }

  /**
   * 页面销毁
   */
  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  /**
   * 改变日期
   */
  onDatePickerChange(result: Date[]) {
    if (result.length) {
      this.timeStart = new Date(result[0]);
      this.timeEnd = new Date(result[1]);
    } else {
      this.timeStart = null;
      this.timeEnd = null;
      this.date = null;
    }
  }

  /**
   * 查询
   */
  async onSearch() {
    // 查询条件
    this.currentQueryParams.keyword = this.keyword || null;
    this.currentQueryParams.timeStart = this.timeStart ? this.timeStart.toISOString() : this.timeStart;
    this.currentQueryParams.timeEnd = this.timeEnd ? this.timeEnd.toISOString() : this.timeEnd;
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
    this.store.dispatch(new DemoActions.GetAll(this.mergeQueryParams(this.route.snapshot.queryParams))).subscribe(() => {
      this.loading = false;
    });
  }

  /**
   * 重置
   */
  async onReset() {
    this.timeStart = null;
    this.timeEnd = null;
    this.date = null;
    this.keyword = null;
    this.currentQueryParams = { ...this.initialQuery };

    const success = await this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { ...this.currentQueryParams }
    });

    if (success === null) {
      this.loading = true;
      this.store.dispatch(new DemoActions.GetAll(this.currentQueryParams)).subscribe(() => {
        this.loading = false;
      });
    }
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
      queryParams: { pageSize },
      queryParamsHandling: 'merge'
    });
  }

  /**
   * 排序方法
   */
  onSortChange(sortStatus: NzTableSortOrder, column: string) {
    const sortString = sortStatus ? `${column}:${sortStatus.replace('end', '')}` : null;
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { sortBy: sortString }
    });
  }

  /**
   * 整合query参数
   */
  private mergeQueryParams(queryParams) {
    const newQueryParams = { ...this.initialQuery, ...queryParams };
    const pageNo = coerceNumberProperty(queryParams.pageNo, newQueryParams.pageNo);
    const pageSize = coerceNumberProperty(queryParams.pageSize, newQueryParams.pageSize);
    newQueryParams.pageNo = pageNo;
    newQueryParams.pageSize = pageSize;
    return newQueryParams;
  }

}
