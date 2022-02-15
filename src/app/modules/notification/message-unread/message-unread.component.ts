import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DataServiceMetadata,
  MessageModel,
  MessageStatusColorMap,
  MessageStatusMap
} from '@api/models';
import { Select, Store } from '@ngxs/store';

import { MessageUnreadActions } from './message-unread.actions';
import { MessageUnreadState } from './message-unread.state';

@Component({
  selector: 'app-message-unread',
  templateUrl: './message-unread.component.html'
})
export class MessageUnreadComponent implements OnInit, OnDestroy {

  @Select(MessageUnreadState.isLoaded) loaded$: Observable<boolean>;

  @Select(MessageUnreadState.isEmpty) empty$: Observable<boolean>;

  /** 列表数据 */
  @Select(MessageUnreadState.getItems) items$: Observable<MessageModel[]>;

  /** 当前页面列表的分页数据 */
  @Select(MessageUnreadState.getMetadata) meta$: Observable<DataServiceMetadata>;

  @Select(MessageUnreadState.getDisplayedColumns) displayedColumns$: Observable<string[]>;

  keywordControl = new FormControl(this.route.snapshot.queryParams.keyword || '');

  loading = false;

  preKeyword = '';

  inputting = false;

  refreshing = false;

  selection: string[] = [];

  currentQueryParams = null;

  statusMap = MessageStatusMap;

  statusColorMap = MessageStatusColorMap;

  private initialQuery = {
    pageNo: 1,
    pageSize: 20,
  };

  private destroy = new Subject();

  private search = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private message: NzMessageService
    // private columnSetting: NtColumnSetting,
  ) { }

  ngOnInit() {

    this.route.queryParams
      .pipe(
        map(params => this.mergeQueryParams(params)),
        tap(params => {
          this.loading = true;
          this.currentQueryParams = params;
        }),
        switchMap(query => this.store.dispatch(new MessageUnreadActions.GetAll(query))),
      )
      .subscribe(() => {
        this.loading = false;
      });

  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  onRefreshing(e: Event) {
    e.stopPropagation();
    this.refreshing = true;
    this.store
      .dispatch(new MessageUnreadActions.GetAll(this.currentQueryParams))
      .subscribe(() => this.refreshing = false);
  }

  onEnter() {
    this.search.next(this.keywordControl.value);
  }

  onBlur() {
    this.inputting = false;
    this.keywordControl.setValue(this.preKeyword, { emitEvent: false });
  }

  trackCurrentSelectedCount() {
    const items = this.store.selectSnapshot(MessageUnreadState.getItems);
    const count = items.filter(item => this.selection.includes(item.id)).length;
    return count === items.length ? '，此页已全选' : ``;
  }

  trackItemSelected(itemId: string) {
    return this.selection.indexOf(itemId) > -1;
  }

  trackAllSelected() {
    const items = this.store.selectSnapshot(MessageUnreadState.getItems) || [];
    return items.every(item => this.selection.indexOf(item.id) > -1);
  }

  trackSomeSelected() {
    const items = this.store.selectSnapshot(MessageUnreadState.getItems);
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
    const items = this.store.selectSnapshot(MessageUnreadState.getItems);
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

  setRead() {
    if (this.selection.length > 0) {
      this.store.dispatch(new MessageUnreadActions.SetRead(this.selection)).pipe(
        switchMap(() => this.store.selectOnce(MessageUnreadState.getUnreadByLimit(5))),
        switchMap(() => this.store.dispatch(new MessageUnreadActions.GetAll(this.currentQueryParams)))
      ).subscribe(() => {
        this.message.success('标记已读成功');
        this.selection = [];
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

  private getCurrentQueryParams() {
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

  private mergeQueryParams(queryParams) {
    const newQueryParams = { ...this.initialQuery, ...queryParams, sortBy: ['createdAt:desc'] };
    const pageNo = coerceNumberProperty(queryParams.pageNo, newQueryParams.pageNo);
    const pageSize = coerceNumberProperty(queryParams.pageSize, newQueryParams.pageSize);
    newQueryParams.pageNo = pageNo;
    newQueryParams.pageSize = pageSize;

    return newQueryParams;
  }

  private cacheUpdatedQueryParams() {
    const { keyword } = this.getCurrentQueryParams();
    this.preKeyword = keyword;
    this.keywordControl.setValue(keyword, { emitEvent: false });
  }

}

