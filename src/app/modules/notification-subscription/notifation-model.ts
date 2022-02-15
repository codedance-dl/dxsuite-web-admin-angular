/* eslint-disable @typescript-eslint/naming-convention */
export enum TemplateType {
  'MOBILE' = 'MOBILE',
  'EMAIL' = 'EMAIL',
  'MESSAGE' = 'MESSAGE'
}

export enum SubscriptionGroupType {
  // 'OPERATION' = 'notification-subscription-operation-group',
  'TENANT' = 'notification'
  // 'SYSTEM' = 'notification-subscription-system-group'
}

export const CHANNEL_SWITCH_TYPE_MAP = {
  onlyEnabled: {
    text: '强制开启',
    disabled: false,
    editable: false
  },
  enabled: {
    text: '默认开启',
    disabled: false,
    editable: true
  },
  disabled: {
    text: '默认关闭',
    disabled: true,
    editable: true
  },
  onlyDisabled: {
    text: '强制关闭',
    disabled: true,
    editable: false
  }
};

export const NOTIFICATION_TEMPLATE_TYPE = {
  MOBILE: {
    text: '短信模板'
  },
  // 'EMAIL': {
  //   text:'邮件模板',
  // },
  MESSAGE: {
    text: '站内信模板'
  }
};
