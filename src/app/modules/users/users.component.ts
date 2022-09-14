import { NzMessageService } from 'ng-zorro-antd/message';
/* eslint-disable @typescript-eslint/naming-convention */
import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataServiceMetadata, RequestQueryParams, User } from '@api/models';
import { UserService } from '@api/user.service';
import { Captcha, CaptchaOptions } from '@components/captcha';
import { Select, Store } from '@ngxs/store';

import { AuthState } from '../../store';
import { UsersActions } from './state/users.actions';
import { UsersState } from './state/users.state';
import { LogsModel } from '@constant/common';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnDestroy {

  @ViewChild('panel') panel: ElementRef;

  @Select(UsersState.isLoaded) loaded$: Observable<boolean>;

  @Select(UsersState.getItems) items$: Observable<LogsModel[]>;

  @Select(UsersState.getMetadata) meta$: Observable<DataServiceMetadata>;

  user: User;

  loading: boolean;

  name: string;

  currentQueryParams = null;

  typeMap = {
    SYSTEM: '系统',
    SUPER: '超级用户',
    ADMINISTRATOR: '管理员',
    USER: '用户'
  };

  private destroy = new Subject();

  private initialQuery = {
    pageNo: 1,
    pageSize: 20
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private userService: UserService,
    private message: NzMessageService,
    private captcha: Captcha,
  ) {
    this.user = this.store.selectSnapshot(AuthState.getIdentity);
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
        switchMap((query: RequestQueryParams | void) => this.store.dispatch(new UsersActions.GetAll(query as RequestQueryParams))),
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
    this.store.dispatch(new UsersActions.GetAll(this.mergeQueryParams(this.route.snapshot.queryParams))).subscribe(() => {
      this.loading = false;
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

  /**
   * 弹出图形验证码验证框
   */
  showCaptcha() {
    const options: CaptchaOptions = {
      title: '请完成安全验证',
      credential: this.user.name,
      hasBackdrop: true
    };
    this.captcha
      .checkAndOpen(this.panel, options)
      .pipe(tap(() => this.loading = false))
      .subscribe(captchaRef => {
        if (captchaRef) {
          captchaRef.afterClosed().subscribe(captchaValue => {
            if (captchaValue) {
              this.download(captchaValue);
            }
          });
        }
      });
  }

  /**
   * 导出用户列表
   */
  download(captchaValue) {
    this.loading = true;
    this.userService.exportUsers({captcha: captchaValue}, this.name ? { name : this.name } : {}).subscribe(
      (res: unknown) => {
        // 创建a标签
        const link = document.createElement('a');
        // 解析返回的文件类型
        const blob = new Blob([res as Blob], { type: 'application/vnd.ms-excel;charset=utf-8' });
        link.style.display = 'none';
        // 文件序列化的过程，将文件转换成可访问的URL（字符串）
        link.href = URL.createObjectURL(blob);
        // 下载的文件名
        link.download = `用户列表.xlsx`;
        link.click();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.message.create('error', error?.error && error?.error.message || '导出失败');
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
