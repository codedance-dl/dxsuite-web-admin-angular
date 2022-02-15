import { Injectable } from '@angular/core';
import { DataService } from '@api/data-service';
import { ImportLogsQuery } from '@api/models';

@Injectable({ providedIn: 'root' })
export class TasksService extends DataService {

  getAll(orgId: string, query?: ImportLogsQuery) {
    return this.http.get(`/tenants/${orgId}/tasks` + this.queryParse(query));
  }

  downloadResult(orgId: string, taskId: string) {
    return this.http.get(`/tenants/${orgId}/tasks/${taskId}/result-file`);
  }

  stopOne(orgId: string, taskId: string) {
    return this.http.post(`/tenants/${orgId}/tasks/${taskId}/stop`, null);
  }

}
