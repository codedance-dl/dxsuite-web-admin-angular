export interface NotificationSubscriptionTemplates {
  name: string;
  description?: string;
  businessGroup?: string;
  category: string;
  mailDisabled?: boolean;
  mailEditable?: boolean;
  mailTemplateId?: string;
  msgDisabled?: boolean;
  msgEditable?: boolean;
  msgTemplateId?: string;
  purpose: string;
  smsDisabled?: boolean;
  smsEditable?: boolean;
  smsTemplateId?: string;
  wxDisabled?: boolean;
  wxEditable?: boolean;
  wxTemplateId?: string;
}

export interface TemplateHierarchy {
  id?: string;
  name?: string;
  description?: string;
  businessGroup?: string;
  category?: string;
  mailDisabled?: boolean;
  mailEditable?: boolean;
  msgDisabled?: boolean;
  msgEditable?: boolean;
  purpose?: string;
  smsDisabled?: boolean;
  smsEditable?: boolean;
  wxDisabled?: boolean;
  wxEditable?: boolean;
  revision?: number;
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

export interface NotificationSubscriptionTrees {
  id?: string;
  name?: string;
  description?: string;
  businessGroup?: string;
  category?: string;
  customerId?: string;
  mailDisabled?: boolean;
  mailEditable?: boolean;
  msgDisabled?: boolean;
  msgEditable?: boolean;
  purpose?: string;
  receiverList?: Receiver[];
  receiverShowList?: ReceiverShow[];
  smsDisabled?: boolean;
  smsEditable?: boolean;
  templateId?: string;
  tenantId?: string;
  wxDisabled?: boolean;
  wxEditable?: boolean;
  revision?: number;
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

export interface Receiver {
  createdAt?: string;
  createdBy?: string;
  deleted?: boolean;
  disabled?: boolean;
  id?: string;
  mobile?: string;
  name?: string;
  namePinyin?: string;
  revision?: number;
  type?: string;
}

export interface ReceiverShow {
  approved?: boolean;
  approvedAt?: string;
  approvedBy?: string;
  company?: {
    createdAt?: string;
    createdBy?: string;
    deleted?: boolean;
    disabled?: boolean;
    id?: string;
    name?: string;
    namePinyin?: string;
    revision?: number;
    type?: string;
  };
  createdAt?: string;
  createdBy?: string;
  deleted?: boolean;
  employeeName?: string;
  id?: string;
  lastModifiedAt?: string;
  lastModifiedBy?: string;
  name?: string;
  revision?: number;
  roles: [];
  user?: string;
}
