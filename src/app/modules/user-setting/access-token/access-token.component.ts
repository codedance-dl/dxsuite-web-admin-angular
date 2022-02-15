import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AccessTokenService } from 'src/api/access-token.service';

import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccessToken, DataServiceResult, User } from '@api/models';
import { Select, Store } from '@ngxs/store';
import { AuthState, ClearIdentity } from '@store/auth';

import { searchDeviceInfo } from '../data/browserdetect';
import { AccessTokenActions } from '../state/access-token.actions';
import { AccessTokenState, DataServiceMetadata } from '../state/access-token.state';

@Component({
  selector: 'app-user-access-token',
  templateUrl: 'access-token.component.html',
  styleUrls: ['access-token.component.less']
})
export class UserAccessTokenComponent implements OnInit, OnDestroy {

  @Select(AuthState.getIdentity) getIdentity$: Observable<User | null>;

  @Select(AccessTokenState.getItems) items$: Observable<AccessToken>;

  @Select(AccessTokenState.isLoaded) loaded$: Observable<boolean>;

  @Select(AccessTokenState.isEmpty) empty$: Observable<boolean>;

  @Select(AccessTokenState.getMetadata) meta$: Observable<DataServiceMetadata>;

  @Select(AccessTokenState.getDisplayedColumns) displayedColumns$: Observable<string[]>;

  userId: string;

  selection: string[];

  loading = false;

  refreshing = false;

  currentQueryParams = null;

  private initialQuery = {
    pageNo: 1,
    pageSize: 20,
  };

  private destroy = new Subject();

  private search = new Subject<string>();

  constructor(
    private message: NzMessageService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private modal: NzModalService,
    private accessTokenService: AccessTokenService
  ) {

    this.getIdentity$.pipe(takeUntil(this.destroy)).subscribe((user: User) => {
      this.userId = (user || {}).id;
    });

  }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        map(params => this.mergeQueryParams(params)),
        tap(params => {
          this.loading = true;
          this.currentQueryParams = params;
        }),
        switchMap(query => this.store.dispatch(new AccessTokenActions.GetAll(this.userId, query))),
      )
      .subscribe(() => {
        this.loading = false;
      });

    this.search
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        const queryParams = this.getCurrentQueryParams();
        queryParams.pageNo = null;
        this.router.navigate(['./'], { relativeTo: this.route, queryParams });
      });
  }

  onRefreshing() {
    this.loading = true;
    this.store
      .dispatch(new AccessTokenActions.GetAll(this.userId, this.currentQueryParams))
      .subscribe(
        () => {
          this.loading = false;
        },
        error => {
          // 删除本机
          if (error.error.code === 'error.access-token-invalid') {
            this.message.create('error', `请重新登录`);
            this.store.dispatch(new ClearIdentity());
          }
        }
      );
  }

  /**
   * 撤销用户令牌
   */
  remove(item) {
    this.modal.confirm({
      nzTitle: '确定强制下线吗？',
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.loading = true;
        this.accessTokenService.deleteOneAccessTokens(this.userId, item.id)
          .subscribe(
            (result: DataServiceResult) => {
              if (result) {
                this.message.create('success', '强制下线成功');
                this.onRefreshing();
              } else {
                this.message.create('error', `强制下线失败，${result.error && result.error.message}`);
              }
              this.loading = false;
            },
            error => {
              this.message.create('error', `强制下线失败，${error.error && error.error.message}`);
              this.loading = false;
            }
          );
      },
      nzCancelText: '取消'
    });
  }

  /**
   * 撤销用户所有令牌
   */
  removeAll() {
    this.modal.confirm({
      nzTitle: '确定全部强制下线吗?',
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.loading = true;
        this.accessTokenService.deleteAccessTokens(this.userId)
          .subscribe(
            (result: DataServiceResult) => {
              if (result) {
                this.message.create('success', '全部强制下线成功');
                this.onRefreshing();
              } else {
                this.message.create('error', `全部强制下线失败，${result.error && result.error.message}`);
              }
              this.loading = false;
            },
            error => {
              this.message.create('error', `全部强制下线失败，${error.error && error.error.message}`);
              this.loading = false;
            }
          );
      },
      nzCancelText: '取消'
    });
  }

  searchDeviceInfo(userAgent: string) {
    return searchDeviceInfo(userAgent);
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

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
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
}
