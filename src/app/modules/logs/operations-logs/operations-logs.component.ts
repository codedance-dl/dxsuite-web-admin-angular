import { addDays, addSeconds } from 'date-fns';
import { NzTableSortOrder } from 'ng-zorro-antd/table';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataServiceMetadata, RequestQueryParams } from '@api/models';
import { Select, Store } from '@ngxs/store';

import { OperationsLogsActions } from '../state/operations-logs.actions';
import { OperationsLogsState } from '../state/operations-logs.state';
import { LogsModel } from '@constant/common';

@Component({
  selector: 'app-operations-logs',
  templateUrl: './operations-logs.component.html',
  styleUrls: ['./operations-logs.component.less']
})
export class OperationsLogsComponent implements OnInit {
  @Select(OperationsLogsState.isLoaded) loaded$: Observable<boolean>;
  @Select(OperationsLogsState.getItems) items$: Observable<LogsModel[]>;
  @Select(OperationsLogsState.getMetadata) meta$: Observable<DataServiceMetadata>;

  loading = false;

  keyword: string;

  refreshing = false;

  currentQueryParams = null;

  timeStart = null;

  timeEnd = null;

  timeOrder: string | null = null;

  date = null;

  inputting = false;

  // 操作结果枚举
  statusArray = [
    { key: 'true', value: '成功' },
    { key: 'false', value: '失败' }
  ];

  detailLogPermissions = [{
    authority: 'access-log.query'
  }];

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
  }

  ngOnInit() {
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

          if (params.sortBy) {
            params.sortBy.indexOf('desc') > -1 && (this.timeOrder = 'descend');
            params.sortBy.indexOf('asc') > -1 && (this.timeOrder = 'ascend');
          }
        }),
        switchMap((query: RequestQueryParams | void) => this.store.dispatch(new OperationsLogsActions.GetAll(query as RequestQueryParams))),
        takeUntil(this.destroy)
      )
      .subscribe(() => {
        this.loading = false;
      });
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
      this.onRefreshing();
    }

  }

  /**
   * 刷新
   */
  onRefreshing() {
    this.loading = true;
    this.store.dispatch(new OperationsLogsActions.GetAll(this.mergeQueryParams(this.route.snapshot.queryParams))).subscribe(() => {
      this.loading = false;
    });
  }

  onDatePickerChange(result: Date[]) {
    if (result.length) {
      this.timeStart = new Date(new Date(result[0]).toLocaleDateString());
      this.timeEnd = new Date(addDays(new Date(addSeconds(new Date(new Date(result[1]).toLocaleDateString()), -1)), 1));
    } else {
      this.timeStart = null;
      this.timeEnd = null;
      this.date = null;
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
      queryParams: {
        pageSize,
        pageNo: 1
      },
      queryParamsHandling: 'merge'
    });
  }

  onSortChange(sortStatus: NzTableSortOrder, column: string) {
    const sortString = sortStatus ? `${column}:${sortStatus.replace('end', '')}` : null;
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { sortBy: sortString }
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
