/* eslint-disable @typescript-eslint/no-namespace */
import { ScheduledJobsQuery } from '@api/models';

export namespace ScheduledJobExecutionsAction {

  export class GetScheduledJobExecutions {
    static readonly type = '[定时任务执行记录] 查询计划任务执行记录';
    constructor(public queryParams?: ScheduledJobsQuery) { }
  }

  export class UpdateDisplayedColumns {
    static readonly type = '[定时任务执行记录] UpdateDisplayedColumns';
    constructor(public displayedColumns: string[]) { }
  }
}
