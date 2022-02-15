export interface ScheduledJobsQuery {
  sortBy?: string[];
  pageNo?: number;
  pageSize?: number;
  status?: string;
  requireTenantId?: boolean;
  scheduledJobCode?: string;
  scheduledJobName?: string;
  serviceId?: string;
  serviceName?: string;
}

export interface SetScheduleJobBody {
  cronExpression: string;
  maxConcurrentJobs: number;
  maxExecutions: number;
  parametersJSON?: string;
  scheduleStartTime: Date | string;
  scheduleEndTime?: Date | string;
}

export interface ScheduledJobSchedulesQuery {
  sortBy?: string[];
  pageNo?: number;
  pageSize?: number;
  finished?: boolean;
  scheduledJobCode?: string;
  scheduledJobId?: string;
  serviceId?: string;
  tenantId?: string;
}

export interface ScheduledJobExecutionsQuery {
  sortBy?: string[];
  pageNo?: number;
  pageSize?: number;
  ended?: boolean;
  scheduleId?: string;
  scheduleStartAtFrom?: Date | string;
  scheduleStartAtTo?: Date | string;
  scheduledJobCode?: string;
  scheduledJobId?: string;
  serviceId?: string;
  startedAtFrom?: Date | string;
  startedAtTo?: Date | string;
  status?: string;
  tenantId?: string;
}

export interface ScheduledJobExecutions {
  id: string;
  cancelledBy: string;
  createdCount: number;
  deletedCount: number;
  ended: boolean;
  endedAt: string;
  errorCount: number;
  errorMessage: string;
  ignoredCount: number;
  lastUpdatedAt: string;
  parametersJSON: string;
  resolvedCount: number;
  schedule: string;
  scheduleStartAt: string;
  scheduleStartOrder: number;
  scheduledJob: string;
  scheduledJobCode: string;
  serviceId: string;
  startedAt: string;
  status: string;
  tenant: string;
  totalCount: number;
  updatedCount: number;
}

export interface Schedule {
  id: string;
  requireTenantId: boolean;
  scheduledJobCode: string;
  scheduledJobName: string;
  serviceId: string;
  serviceName: string;
  revision: number;
  createdAt: string;
  createdBy: string;
  lastModifiedAt: string;
  lastModifiedBy: string;
  deletedAt: string;
  deletedBy: string;
  deleted: boolean;
}

export interface ScheduledJobSchedules {
  id: string;
  cronExpression: string;
  executionCount: number;
  finished: boolean;
  maxConcurrentJobs: number;
  maxExecutions: number;
  nextStartAt: string;
  nextStartAtMS: number;
  parametersJSON: string;
  scheduleEndTime: string;
  scheduleEndTimeMS: number;
  scheduleStartTime: string;
  scheduledJob: string;
  scheduledJobCode: string;
  serviceId: string;
  tenant: string;
  revision: number;
  createdAt: string;
  createdBy: string;
  lastModifiedAt: string;
  lastModifiedBy: string;
  deletedAt: string;
  deletedBy: string;
  deleted: boolean;
}
