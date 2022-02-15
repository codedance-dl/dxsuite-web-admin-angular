import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableSortOrder } from 'ng-zorro-antd/table';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee, EmployeeQuery } from '@api/models';
import { Select, Store } from '@ngxs/store';

import { EmployeesModel } from './data/employees.model';
import { EmployeeResetPasswordComponent } from './employee-reset-password';
import { EmployeesActions } from './employees.actions';
import { DataServiceMetadata, EmployeesState } from './employees.state';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees-commons.component.less']
})
export class EmployeesComponent implements OnInit, OnDestroy {

  /** 列表数据 */
  @Select(EmployeesState.getItems) items$: Observable<EmployeesModel[]>;

  @Select(EmployeesState.isLoaded) loaded$: Observable<boolean>;

  @Select(EmployeesState.isEmpty) empty$: Observable<boolean>;

  /** 当前页面列表的分页数据 */
  @Select(EmployeesState.getMetadata) meta$: Observable<DataServiceMetadata>;

  loading = false;

  confirmModal: NzModalRef;

  form: FormGroup;

  inviteEmployeePermissions = [{
    authority: 'employee.invite'
  }];

  deleteEmployeePermissions = [{
    authority: 'employee.delete'
  }];

  detailEmployeePermissions = [{
    authority: 'employee.query-detail'
  }];

  // 成员重置密码的权限
  tenantResetEmployeePermissions = [{
    authority: 'tenent.set-employee-password'
  }];

  private initialQuery = {
    pageNo: 1,
    pageSize: 20,
    approval: 'ALL',
    sortBy: 'createdAt:desc'
  };

  private destroy = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private formBuilder: FormBuilder,
    private notifier: NzMessageService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef

  ) {
    this.form = this.formBuilder.group({
      name: this.route.snapshot.queryParams.name || null,
      approval: null
    });
  }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        tap(() => this.loading = true),
        map(params => this.mergeQueryParams(params)),
        switchMap(queryParams => this.store.dispatch(new EmployeesActions.GetAll(queryParams)))
      )
      .subscribe(() => {
        this.loading = false;
      });
  }

  onClickRemove({ id, name, revision }) {
    this.modal.confirm({
      nzTitle: `确定要删除：${name} 吗？`,
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.store.dispatch(new EmployeesActions.DeleteOne(id, revision)).subscribe(
          () => {
            this.notifier.success(`删除${name}成功`);
            this.onRefreshing();
          },
          error => {
            this.notifier.error(`删除${name}失败，${error.message}`);
          }
        );
      },
      nzCancelText: '取消'
    });

  }

  // 重置成员密码弹出框
  openResetPassword(employee: Employee) {
    const modal = this.modal.create({
      nzTitle: '重置成员：'+ employee.name + '密码',
      nzContent: EmployeeResetPasswordComponent,
      nzFooter: null,
      nzViewContainerRef: this.viewContainerRef,
      nzWidth: 450,
      nzComponentParams: { employee },
    });
    modal.afterClose.subscribe(() => {
      this.store.dispatch(new EmployeesActions.GetAll(this.mergeQueryParams(this.route.snapshot.queryParams)));
    });
  }

  /**
   * 刷新
   */
  onRefreshing() {
    this.loading = true;
    this.store.dispatch(
      new EmployeesActions.GetAll(this.mergeQueryParams(this.route.snapshot.queryParams))
    ).subscribe(() => this.loading = false);
  }

  /**
   * 查询
   */
  async onSearch() {
    const queryParams: Partial<EmployeeQuery> = this.form.value;
    for (const item in queryParams) {
      if (Reflect.hasOwnProperty.call(queryParams, item)) {
        queryParams[item] = queryParams[item] ? queryParams[item].trim() : null;
      }
    }
    // value变更，pageNo重置到第一页
    const notChange = Object.keys(queryParams).every(key => this.route.snapshot.queryParams[key] === queryParams[key]);
    if (notChange) {
      return;
    }
    queryParams.pageNo = null;

    const success = await this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });

    if (success === null) {
      this.onRefreshing();
    }
  }

  /**
   * 分页方法
   */
  onPageChange(pageNo: number) {
    const no = pageNo === this.initialQuery.pageNo ? null : pageNo;
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { pageNo: no },
      queryParamsHandling: 'merge'
    });
  }
  /**
   * 每页条数改变
   */
  onPageSizeChange(pageSize) {
    const size = pageSize === this.initialQuery.pageSize ? null : pageSize;
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: {
        pageSize: size,
        pageNo: 1
      },
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

  formatSortBy(sortBy: string): Record<string, string | null> {
    const sort: Record<string, string | null> = {};
    [sortBy].forEach(item => {
      const array = item.split(':');
      sort[array[0]] = array[1];
    });
    return sort;
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  private mergeQueryParams(queryParams) {
    const newQueryParams: Partial<EmployeeQuery> = { ...this.initialQuery, ...queryParams };

    const pageNo = coerceNumberProperty(queryParams.pageNo, newQueryParams.pageNo);
    const pageSize = coerceNumberProperty(queryParams.pageSize, newQueryParams.pageSize);

    newQueryParams.pageNo = pageNo;
    newQueryParams.pageSize = pageSize;

    return newQueryParams;
  }

}
