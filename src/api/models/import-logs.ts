import { BaseQuery } from ".";

export interface ImportLogsModel {
  id: string;
  code?: string;
  totalCount: number;
  processedCount: number;
  failedCount: number;
  finishedAt: Date;
  createdAt: Date;
  status: ImportLogsStatus;
  importFileName: string;
}

export type ImportLogsStatus = 'PENDING' | 'RUNNING' | 'STOPPED' | 'FINISHED' | 'FAILED';

export interface ImportLogsQuery extends BaseQuery {
  status?: string;
  code?: string;
}

export const IMPORT_LOGS_STATUS_LIST = [
  { value: 'RUNNING', text: '执行中' },
  { value: 'FINISHED', text: '完成' },
  { value: 'FAILED', text: '失败' },
  { value: 'STOPPED', text: '停止' },
  { value: 'PENDING', text: '未开始' }
];

export const IMPORT_LOGS_STATUS_MAP = {
  RUNNING: '执行中',
  FINISHED: '完成',
  FAILED: '失败',
  STOPPED: '停止',
  PENDING: '未开始'
};

export const IMPORT_LOGS_STATUS_COLOR_MAP = {
  'RUNNING': 'warning',
  'FINISHED': 'success',
  'FAILED': 'error',
  'STOPPED': 'error',
  'PENDING': 'secondary'
};
