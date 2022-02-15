import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Subject } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PERMISSION_METADATA, PermissionMeta } from '@app/permissions';
import { Select, Store } from '@ngxs/store';

import { RolesModel } from './data/roles.model';
import { RolesActions } from './roles.actions';
import { RolesState } from './roles.state';

// 权限数组整合，筛选出选中的权限所在组
const findArray = (value: string, array: PermissionMeta[]) => {
  for (const a of array) {
    for (const b of a.children) {
      if (value.indexOf(b.authority) > -1) {
        return b;
      }
    }
  }
};

@Component({
  templateUrl: 'privileges.component.html',
  styleUrls: ['roles-menu.less', 'privileges.component.less']
})
export class RolesPrivilegesComponent implements OnInit, OnDestroy {
  @Select(RolesState.getItems) roles$: Observable<RolesModel[]>;

  privilegesSnapshot: string[];

  permissionStrategy = JSON.parse(JSON.stringify(PERMISSION_METADATA));

  roleId = '';

  loading = false;

  name: string;

  // 角色详情
  detail: RolesModel;

  private destroy = new Subject();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private message: NzMessageService
  ) {
    this.roleId = this.route.snapshot.params.roleId;
  }

  ngOnInit() {
    // 获取角色详情
    this.getDetails();
    this.store.dispatch(new RolesActions.GetOne(this.roleId));
    this.store.select(RolesState.getPrivilegesById(this.roleId)).subscribe((res) => {
      this.privilegesSnapshot = res || [];
      this.permissionStrategy.forEach((permission) => {
        (permission.children || []).forEach((child) => {
          (child.permissions || []).forEach((item) => {
            this.privilegesSnapshot.forEach(privilege => {
              if (privilege === item.authority) {
                item.checked = true;
              }
              if (child.permissions.length === 1) {
                item.disabled = false;
              }
            });
          });
          (child.permissions || []).forEach((item) => {
            if (/.query$/.test(item.authority) && child.permissions.filter(i => i.checked).length > 1) {
              item.disabled = true;
            }
          });
        });
      });
    });
  }

  /**
   * 获取角色详情
   */
  getDetails() {
    this.store.select(RolesState.getRoles(this.roleId)).subscribe((response) => {
      this.detail = response;
    });
  }

  /**
   * 选中回调
   * @param authority
   */
  checkBoxChange(authority) {
    this.permissionStrategy.forEach((item) => {
      item.children.forEach((child) => {
        child.permissions.forEach(permission => {
          if (permission.authority === authority.authority) {
            permission.checked = !permission.checked;
          }
        });
      });
    });
    // 1、选中个数大于0，并且没有包含query的：query选中，并且禁用
    // 2、选中个数大于1：query选中，并且禁用
    // 3、选中个数等于1，并且为query：query选中，不禁用
    const permissions = findArray(authority.authority, this.permissionStrategy).permissions;
    if (permissions.filter(permission => permission.checked).length > 0
      && permissions.filter(permission => permission.checked).every(permission => !/.query$/.test(permission.authority))
      || permissions.filter(permission => permission.checked).length > 1) {
      permissions.find(permission => /.query$/.test(permission.authority)).disabled = true;
      permissions.find(permission => /.query$/.test(permission.authority)).checked = true;
    } else if (permissions.filter(permission => permission.checked).length === 1 && /.query$/.test(permissions[0].authority)) {
      permissions.find(permission => /.query$/.test(permission.authority)).disabled = false;
      permissions.find(permission => /.query$/.test(permission.authority)).checked = true;
    }
  }

  /**
   * 提交
   */
  setSelected() {
    this.loading = true;
    let selected = [];
    this.permissionStrategy.forEach((permission) => {
      (permission.children || []).forEach((child) => {
        selected = selected.concat((child.permissions || [])
          .filter((item) => item.checked));
      });
    });
    selected = selected.map(item => item.authority);
    if (selected.indexOf('employee.create') !== -1) {
      selected.push('employee.invite');
    }
    this.store.dispatch(new RolesActions.AssignPrivileges(this.roleId, selected, this.detail.revision))
      .subscribe(() => {
        this.loading = false;
        this.message.create('success', '权限修改成功');
        this.getDetails();
      },
        (error) => {
          this.message.create('error', error.message || error.error.message);
          this.loading = false;
        }
      );
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  get trackDisabled() {
    return !!this.privilegesSnapshot.find(snapshot => {
      return snapshot.indexOf('.') === -1;
    });
  }

}
