

import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Employee, EmployeeQuery } from '@api/models';

import { DataService } from './data-service';

@Injectable({ providedIn: 'root' })
export class EmployeesService extends DataService {

  // 取得公司的职员列表
  search(tenantId: string, query?: Partial<EmployeeQuery>) {
    return this.http.get(`/tenants/${tenantId}/employees` + this.queryParse(query));
  }

  // 取得职员详细信息
  detail(tenantId: string, employeeId: string) {
    return this.http.get(`/tenants/${tenantId}/employees/${employeeId}`);
  }

  approve(tenantId: string, userIDs: string) {
    return this.http.post(`/tenants/${tenantId}/employees/${userIDs}/approve`, null);
  }

  // 将用户加入到公司
  addEmployees(tenantId: string, userId: string) {
    return this.http.patch(`/tenants/${tenantId}/employee/${userId}`);
  }

  // 将用户从公司退出
  removeEmployees(tenantId: string, userIds: string, revision: number) {
    return this.http.delete(`/tenants/${tenantId}/employees/${userIds}?revision=${revision}`, {});
  }

  // 更新职员名称
  employeeName(tenantId: string, employeeId: string, data: Partial<Employee>) {
    return this.http.put(`/tenants/${tenantId}/employees/${employeeId}/employeeName`, data);
  }

  getTenantByUserId(id: string) {
    return this.http.get(`/users/${id}/companies` + this.queryParse({ orgType: 'tenant' }))
      .pipe(switchMap(({ data }) => {
        if (data && data.length > 0) {
          const tenants = [];
          data.forEach(item => {
            const tenant = {
              ...item.tenant,
              orgId: item.tenantOrg.id,
              employeeId: item.id,
              account: item.account
            };
            if (item.roles && item.roles.length > 0) {
              tenant.authorities = item.roles.map(role => role.authorities).flat(Infinity);
            }
            tenants.push(tenant);
          });
          return of({
            tenants
          });
        } else {
          return of(null);
        }
      }));
  }

  inviteEmployee(tenantId: string, body: {
    name: string;
    email?: string;
    expiresAt?: string;
    mobile?: string;
    employeeNo?: string;
    userId?: string;
    userCredential?: string;
  }) {
    return this.http.post(`/tenants/${tenantId}/employee-invitations`, body);
  }


  accept(tenantId: string, invitationId: string, code: string) {
    return this.http.post(`/tenants/${tenantId}/employee-invitations/${invitationId}/accept`, {
      code
    });
  }

  getInvitation(invitationId: string, invitationCode: string) {
    return this.http.get(`/invitations/${invitationId}` + this.queryParse({ code: invitationCode}));
  }

  createEmployee(tenantId, data: {
    name?: string;
    email?: string;
    expiresAt?: string;
    mobile?: string;
    no?: string;
    userId?: string;
  }) {
    return this.http.post(`/tenants/${tenantId}/employees`, data);
  }

  // 重置成员的密码
  resetPassword(tenantId: string, employeeId: string, password: string) {
    return this.http.post(`/tenants/${tenantId}/employees/${employeeId}/password`, { password });
  }

}
