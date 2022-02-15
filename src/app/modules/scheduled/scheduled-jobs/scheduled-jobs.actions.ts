import { ScheduledJobsQuery } from '@api/models';

export namespace ScheduledJobsAction {

  export class GetScheduledJobSchedules{
    static readonly type = '[定时任务执行计划] 查询计划任务执行计划';
    constructor(public queryParams?: ScheduledJobsQuery) { }
  }

  export class UpdateDisplayedColumns {
    static readonly type = '[定时任务执行计划] UpdateDisplayedColumns';
    constructor(public displayedColumns: string[]) { }
  }
}
