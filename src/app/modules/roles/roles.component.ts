import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '@api';
import { BaseQuery, DataServiceMetadata, Role, User } from '@api/models';
import { Select, Store } from '@ngxs/store';
import { AuthState } from '@store/auth';

import { RolesAddComponent } from './add.component';
import { RolesModel } from './data/roles.model';
import { RolesEditComponent } from './edit.component';
import { RolesActions } from './roles.actions';
import { RolesState } from './roles.state';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.less']
})
export class RolesComponent implements OnInit, OnDestroy {

  @Select(RolesState.isLoaded) loaded$: Observable<boolean>;

  @Select(RolesState.isEmpty) empty$: Observable<boolean>;

  /** 列表数据 */
  @Select(RolesState.getItems) items$: Observable<RolesModel[]>;

  /** 当前页面列表的分页数据 */
  @Select(RolesState.getMetadata) meta$: Observable<DataServiceMetadata>;

  @Select(RolesState.getDisplayedColumns) displayedColumns$: Observable<string[]>;

  name: string;

  loading = false;

  refreshing = false;

  currentQueryParams: BaseQuery = null;

  currentUser: User;

  createRolePermissions = [{
    authority: 'role.create'
  }];

  deleteRolePermissions = [{
    authority: 'role.delete'
  }];

  updateRolePermissions = [{
    authority: 'role.update'
  }];

  private initialQuery = {
    pageNo: 1,
    pageSize: 20
  };

  private destroy = new Subject();

  constructor(
    private message: NzMessageService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private roleService: RoleService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef
  ) {
  }

  ngOnInit() {
    this.store
      .select(AuthState.getIdentity)
      .pipe(takeUntil(this.destroy))
      .subscribe((user) => {
        this.currentUser = user;
      });

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
        switchMap((query) => this.store.dispatch(new RolesActions.GetAll(query))),
        takeUntil(this.destroy)
      )
      .subscribe(() => {
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

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
      this.onRefreshing();
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

  /**
   * 刷新
   */
  onRefreshing() {
    this.refreshing = true;
    this.store
      .dispatch(new RolesActions.GetAll(this.currentQueryParams))
      .subscribe(() => {
        this.refreshing = false;
      });
  }

  add() {
    const modal = this.modal.create({
      nzTitle: '新建角色',
      nzContent: RolesAddComponent,
      nzFooter: null,
      nzViewContainerRef: this.viewContainerRef,
      nzWidth: 450
    });
    modal.afterClose.subscribe(() => {
      this.store
        .dispatch(new RolesActions.GetAll(this.currentQueryParams));
    });
  }

  edit(data: Role) {
    const modal = this.modal.create({
      nzTitle: '编辑角色',
      nzContent: RolesEditComponent,
      nzFooter: null,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: { data },
      nzWidth: 450
    });
    modal.afterClose.subscribe(() => {
      this.store
        .dispatch(new RolesActions.GetAll(this.currentQueryParams));
    });
  }

  // canDelete(item) {
  //   return !(item.authorities || []).find((privilege) => privilege.scope === 'all' && privilege.permission === 'ALL');
  // }

  delete(role: RolesModel) {
    const orgId = environment.orgId;
    this.roleService.member(orgId, role.id).subscribe((res) => {
      if (res.data.length > 0) {
        this.message.create('warning', '请移除成员中的该角色后，再删除该角色');
      } else {
        this.modal.confirm({
          nzTitle: `确定要删除：${role.name} 吗？`,
          nzOkText: '确定',
          nzOkType: 'primary',
          nzOkDanger: true,
          nzOnOk: () => {
            this.store.dispatch(new RolesActions.RemoveOne(role.id, role.revision)).subscribe(
              () => {
                this.message.create('success', '删除角色成功');
              },
              (error) => {
                this.message.create('error', error.message || error.error.message);
              }
            );
          },
          nzCancelText: '取消'
        });
      }
    });
  }

  isCurrent(id: string) {
    const userIds = (this.currentUser.roles || []).map((role: Role) => role.id);
    return userIds.indexOf(id) > -1 ? true : false;
  }

  isAdministrator (authorities: string[]) {
    return authorities.indexOf('all') > -1 ? true : false;
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
