import { addDays, addSeconds } from 'date-fns';
import * as moment from 'moment';
import { NzTableSortOrder } from 'ng-zorro-antd/table';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataServiceMetadata, RequestQueryParams } from '@api/models';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';

import { UIActions, UIState } from '../../nav/customization';
import { I18nLogsModel } from './data/logs.model';
import { I18nLogsActions } from './state/logs.actions';
import { I18nLogsState } from './state/logs.state';

@Component({
  selector: 'app-i18n-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.less']
})
export class I18nLogsComponent implements OnInit {
  @Select(I18nLogsState.isLoaded) loaded$: Observable<boolean>;
  @Select(I18nLogsState.getItems) items$: Observable<I18nLogsModel[]>;
  @Select(I18nLogsState.getMetadata) meta$: Observable<DataServiceMetadata>;
  @Select(UIState.getLanguage) lang$: Observable<string>;

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

  translateMessage: JSON;

  time: string;

  private destroy = new Subject();

  private initialQuery = {
    pageNo: 1,
    pageSize: 20,
    sortBy: ['time:desc']
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private translateService: TranslateService
  ) {
    let lang = '';
    this.lang$.subscribe((data) => {
      this.translateService.use(data);
      lang = data;
      moment.locale(data);
      this.setTime(localStorage.getItem('language'));

    });

    this.translateService.onLangChange.pipe(
      switchMap(params => this.store.dispatch(new UIActions.ChangeLanguage(params.lang))),
      // 国际化 translate 在ts中使用, 获取想使用的文言
      switchMap(() => this.translateService.get(['common.message.success']))
    ).subscribe((res) => {
      this.translateMessage = res;
    });

    setInterval(() => {
      this.setTime(lang);
    }, 1000);

  }

  setTime(lang: string) {
    if (lang === 'zh-cn') {
      this.time = moment().format('ll LTS');
    } else if (lang === 'en-gb') {
      this.time = moment().format('L, LTS');
    } else if (lang === 'ja-jp') {
      this.time = moment().format('L LTS');
    }
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
        switchMap((query: RequestQueryParams | void) => this.store.dispatch(new I18nLogsActions.GetAll(query as RequestQueryParams))),
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
    this.store.dispatch(new I18nLogsActions.GetAll(this.mergeQueryParams(this.route.snapshot.queryParams))).subscribe(() => {
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


