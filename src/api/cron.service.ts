import { Injectable } from '@angular/core';

import { DataService } from './data-service';
import {
  ScheduledJobExecutionsQuery,
  ScheduledJobSchedulesQuery,
  ScheduledJobsQuery,
  SetScheduleJobBody
} from './models';

@Injectable({ providedIn: 'root' })
export class CronService extends DataService {
  // 查询定时任务
  getScheduledJobs(query?: ScheduledJobsQuery) {
    return this.http.get(`/scheduled-jobs` + this.queryParse(query));
  }

  // 设置计划任务执行计划
  setScheduledJob(scheduledJobId: string, revision: number, body: SetScheduleJobBody) {
    return this.http.put(`/scheduled-jobs/${scheduledJobId}/schedule` + this.queryParse({ revision }), body);
  }

  // 查询计划任务执行计划
  getScheduledJobSchedules(query?: ScheduledJobSchedulesQuery) {
    return this.http.get(`/scheduled-job-schedules` + this.queryParse(query));
  }

  // 执行记录
  getScheduledJobExecutions(query?: ScheduledJobExecutionsQuery) {
    return this.http.get(`/scheduled-job-executions` + this.queryParse(query));
  }

  // 删除计划
  deleteScheduledJob(scheduledJobId: string, revision: number) {
    return this.http.delete(`/scheduled-jobs/${scheduledJobId}/schedule` + this.queryParse({ revision }));
  }

}
