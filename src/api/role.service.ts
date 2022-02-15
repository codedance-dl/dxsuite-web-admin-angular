import { Injectable } from '@angular/core';

import { DataService } from './data-service';
import { RolesBody, BaseQuery } from './models';

@Injectable({ providedIn: 'root' })
export class RoleService extends DataService {

  // 查询角色组
  getAll(tenantId: string, query?: BaseQuery) {
    return this.http.get(`/tenants/${tenantId}/roles` + this.queryParse(query));
  }

  // 获取角色组信息
  detail(tenantId: string, roleId: string) {
    return this.http.get(`/tenants/${tenantId}/roles/${roleId}`);
  }

  // 创建角色组
  create(tenantId: string, data: RolesBody) {
    return this.http.post(`/tenants/${tenantId}/roles`, data);
  }
  // 更新角色组信息
  update(tenantId: string, roleId: string, data: RolesBody, revision?: number) {
    return this.http.patch(`/tenants/${tenantId}/roles/${roleId}` + this.queryParse({ revision }), data);
  }
  // 删除角色组
  delete(tenantId: string, roleId: string, revision?: number) {
    return this.http.delete(`/tenants/${tenantId}/roles/${roleId}` + this.queryParse({ revision }));
  }

  // 为角色分配权限
  setPrivileges(tenantId: string, roleId: string, revision: number, data: { authorities: string[] }) {
    return this.http.patch(`/tenants/${tenantId}/roles/${roleId}?revision=${revision}`, data);
  }

  // 查询角色成员
  member(tenantId: string, roleId: string, query?: {
    pageNo?: number;
    pageSize?: number;
    sortBy?: string[];
    employeeId?: string;
  }) {
    return this.http.get(`/tenants/${tenantId}/roles/${roleId}/members` + this.queryParse(query));
  }
  // 角色成员详情
  memberDetail(tenantId: string, roleId: string, memberId: string) {
    return this.http.get(`/tenants/${tenantId}/roles/${roleId}/members/${memberId}`);
  }
  // 添加成员到角色
  addMember(tenantId: string, roleId: string, data: { employeeId: string }) {
    return this.http.post(`/tenants/${tenantId}/roles/${roleId}/members`, data);
  }
  // 从角色中删除职员
  deleteMember(tenantId: string, roleId: string, memberId: string, revision: number) {
    return this.http.delete(`/tenants/${tenantId}/roles/${roleId}/members/${memberId}?revision=${revision}`);
  }
}
