export const LogsColumns = [
  // { name: 'code', label: '操作类型', enable: true },
  // { name: 'importFileName', label: '导入文件名称', optional: true, enable: false },
  { name: 'createdAt', label: '开始时间', optional: true, enable: true },
  { name: 'finishedAt', label: '结束时间', optional: true, enable: true },
  { name: 'status', label: '执行状态', optional: true, enable: true },
  // { name: 'process', label: '导入进度', optional: true, enable: true },
  { name: 'createdBy', label: '操作人', optional: true, enable: true },
  { name: 'lastModifiedAt', label: '最后更新时间', optional: true, enable: false },
  { name: 'totalCount', label: '导入总数', optional: true, enable: true },
  { name: 'processedCount', label: '已处理件数', optional: true, enable: true },
  { name: 'failedCount', label: '失败总数', optional: true, enable: true }
];

export const LogsDisplayedColumnName = 'logsColumns';
