import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DataServiceMetadata,
  IS_READ_LIST,
  MessageModel,
  MessageStatusColorMap,
  MessageStatusMap
} from '@api/models';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';

import { UIActions, UIState } from '../../nav/customization';
import { I18nMessageActions } from './message.actions';
import { I18nMessageState } from './message.state';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html'
})
export class MessageComponent implements OnInit, OnDestroy {
  @Select(I18nMessageState.isLoaded) loaded$: Observable<boolean>;
  /** 列表数据 */
  @Select(I18nMessageState.getItems) items$: Observable<MessageModel[]>;

  /** 当前页面列表的分页数据 */
  @Select(I18nMessageState.getMetadata) meta$: Observable<DataServiceMetadata>;
  // 获取国际化语言
  @Select(UIState.getLanguage) lang$: Observable<string>;
  loading = false;
  refreshing = false;
  selection: string[] = [];
  currentQueryParams = null;

  isReadList = IS_READ_LIST;

  statusMap = MessageStatusMap;

  statusColorMap = MessageStatusColorMap;

  translateMessage: string | string[];

  private destroy = new Subject();

  private initialQuery = {
    pageNo: 1,
    pageSize: 20,
    sortBy: ['createdAt:desc']
  };
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private message: NzMessageService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        map(params => this.mergeQueryParams(params)),
        tap(params => {
          this.loading = true;
          this.currentQueryParams = params;
        }),
        switchMap(query => this.store.dispatch(new I18nMessageActions.GetAll(query))),
        takeUntil(this.destroy)
      )
      .subscribe(() => {
        this.loading = false;
      });

    this.lang$.subscribe((data) => {
      this.translateService.use(data);
    });

    this.translateService.onLangChange.pipe(
      switchMap(params => this.store.dispatch(new UIActions.ChangeLanguage(params.lang))),
      // 国际化 translate 在ts中使用, 获取想使用的文言
      switchMap(() => this.translateService.get(['common.message.success']))
    ).subscribe((res) => {
      this.translateMessage = res;
    });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  onRefreshing() {
    this.refreshing = true;
    this.store
      .dispatch(new I18nMessageActions.GetAll(this.currentQueryParams))
      .subscribe(() => this.refreshing = false);
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
  /**
   * 设置已读
   */
  setRead() {
    if (this.selection.length > 0) {
      this.store.dispatch(new I18nMessageActions.SetRead(this.selection)).pipe(
        switchMap(() => this.store.dispatch(new I18nMessageActions.GetAll(this.currentQueryParams)))
      ).subscribe(() => {
        this.message.success(this.translateMessage['common.message.success']);
        this.selection = [];
      });
    }
  }

  trackCurrentSelectedCount() {
    const items = this.store.selectSnapshot(I18nMessageState.getItems);
    const count = items.filter(item => this.selection.includes(item.id)).length;
    return count === items.length ? '，此页已全选' : ``;
  }

  trackItemSelected(itemId: string) {
    return this.selection.indexOf(itemId) > -1;
  }

  trackAllSelected() {
    const items = this.store.selectSnapshot(I18nMessageState.getItems);
    return items.every(item => this.selection.indexOf(item.id) > -1);
  }

  trackSomeSelected() {
    const items = this.store.selectSnapshot(I18nMessageState.getItems);
    return items.some(item => this.selection.indexOf(item.id) > -1);
  }

  selectOne(checked: boolean, itemId: string) {
    if (!checked) {
      const index = this.selection.indexOf(itemId);
      this.selection.splice(index, 1);
    } else {
      this.selection.push(itemId);
    }
  }

  selectAll(checked: boolean) {
    const items = this.store.selectSnapshot(I18nMessageState.getItems);
    if (!checked) {
      items.forEach(item => {
        const index = this.selection.indexOf(item.id);
        if (index > -1) {
          this.selection.splice(index, 1);
        }
      });
    } else {
      items.forEach(item => {
        if (!this.selection.includes(item.id)) {
          this.selection.push(item.id);
        }
      });
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

  filterQueryFunction(type: string, value: string) {
    const queryParams = this.getCurrentQueryParams();
    queryParams[type] = value;
    this.router.navigate(['./'], { relativeTo: this.route, queryParams });
  }

  private mergeQueryParams(queryParams) {
    const newQueryParams = { ...this.initialQuery, ...queryParams };
    const pageNo = coerceNumberProperty(queryParams.pageNo, newQueryParams.pageNo);
    const pageSize = coerceNumberProperty(queryParams.pageSize, newQueryParams.pageSize);
    newQueryParams.pageNo = pageNo;
    newQueryParams.pageSize = pageSize;
    return newQueryParams;
  }

  private getCurrentQueryParams() {
    return { ...this.route.snapshot.queryParams };
  }

}
