/* eslint-disable @typescript-eslint/naming-convention */

export interface NotificationTemplateModel {
  id?: string;
  name?: string;
  description?: string;
  configurationId?: string;
  tagList?: string[];
  contents?: [{
    content?: string;
    contentType?: string;
    languageCode?: string;
    subject?: string;
  }];
  revision?: string;
  createdAt?: string;
  createdBy?: string;
  lastModifiedAt?: string;
  lastModifiedBy?: string;
  disabledAt?: string;
  disabledBy?: string;
  disabled?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  deleted?: boolean;
}

export enum NotificationTemplateType {
  mobile = 'mobile',
  laptop = 'laptop'
}

export enum NotificationTemplateStatus {
  true = 'true',
  false = 'false'
}

export const NotificationTemplateStatusMap = {
  true: '停用',
  false: '启用'
};

export const NotificationTemplateStatusColorMap = {
  false: 'success',
  true: 'error'
};
