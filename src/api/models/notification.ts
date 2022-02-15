/* eslint-disable @typescript-eslint/naming-convention */
// 通知消息分组
export interface NotificationSubscriptionGroup {
  id?: string; // 实体 ID
  name: string; // 名称
  category: string; // 分类
  key: string; // 业务代码
  description?: string; // 描述
}

// 通知消息类型
export interface NotificationSubscriptionTemplate {
  id?: string; // 实体 ID
  name: string; // 名称
  category: CategoryType; // 分类
  key: string; // 业务代码
  description?: string; // 描述
  groupId: string;
  mailChannel: {
    readOnly: boolean;
    switch: boolean;
    notificationTemplateId: string;
  };
  smsChannel: {
    readOnly: boolean;
    switch: boolean;
    notificationTemplateId: string;
  };
}

export enum CategoryType {
  OPERATION = 'OPERATION',
  TENANT = 'TENANT',
  SYSTEM = 'SYSTEM'
}
