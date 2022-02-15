import { Injectable } from '@angular/core';

import { DataService } from './data-service';
import { ImportLogsQuery, BaseQuery } from './models';

@Injectable({ providedIn: 'root' })
export class LogsService extends DataService {

  // 查询操作审计（系统管理员查询）
  getAll(query: BaseQuery) {
    return this.http.get(`/access-logs` + this.queryParse(query));
  }

  // 取得操作审计详细信息（系统管理员查询）
  getOne(accessLogId: string) {
    return this.http.get(`/access-logs/${accessLogId}`);
  }

  // 取得控制器方法列表
  getControllerMethod() {
    return this.http.get(`/controller-methods`);
  }

  // 任务查询
  log(tenantId: string, query?: ImportLogsQuery) {
    return this.http.get(`/tenants/${tenantId}/tasks` + this.queryParse(query));
  }

  // 下载导入结果文件
  downloadParamsResult(taskId: string) {
    return this.http.get(`/tenant-api/tasks/${taskId}/result-file`);
  }

  stopTask(tenantId?: string, taskId?: string) {
    return this.http.post(`/tenants/${tenantId}/tasks/${taskId}/stop`, {});
  }
}
