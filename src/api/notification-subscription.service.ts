import { Injectable } from '@angular/core';
import { DataService } from './data-service';
@Injectable({ providedIn: 'root' })
export class NotificationSubscriptionService extends DataService {
  // 创建订阅模板
  create(data: {
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
  }) {
    return this.http.post(`/notification-subscription-templates`, data);
  }

  // 更新订阅模板
  update(
    templateId: string,
    revision: number,
    data: {
      name?: string;
      description?: string;
      businessGroup?: string;
      category?: string;
      mailDisabled?: boolean;
      mailEditable?: boolean;
      mailTemplateId?: string;
      msgDisabled?: boolean;
      msgEditable?: boolean;
      msgTemplateId?: string;
      purpose?: string;
      smsDisabled?: boolean;
      smsEditable?: boolean;
      smsTemplateId?: string;
      wxDisabled?: boolean;
      wxEditable?: boolean;
      wxTemplateId?: string;
    }
  ) {
    return this.http.patch(`/notification-subscription-templates/${templateId}` + this.queryParse({ revision }), data);
  }

  // 取得订阅模板详细信息
  detail(templateId: string) {
    return this.http.get(`/notification-subscription-templates/${templateId}`);
  }

  // 删除订阅模板
  delete(templateId: string, revision: number) {
    return this.http.delete(`/notification-subscription-templates/${templateId}` + this.queryParse({ revision }), {});
  }

  // 获取模板（分组划分）
  getTemplateHierarchy(query?: {
    category?: string;
    businessGroup?: string;
    name?: string;
    pageNo?: number;
    pageSize?: number;
    purpose?: string;
    sortBy?: string[];
  }) {
    return this.http.get(`/notification-subscription-templates` + this.queryParse(query));
  }

  getTemplateTrees() {
    return this.http.get(`/notification-subscription-template-trees`);
  }

  // 设置订阅频道开关
  setSwitches(subscriptionId: string, revision: number, action: string) {
    return this.http.post(`/notification-subscriptions/${subscriptionId}/${action}` + this.queryParse({ revision }), {});
  }

  customerInit(customerId: string, force: boolean) {
    return this.http.post(`/notification-subscriptions/customers/${customerId}/init` + this.queryParse({ force }), {});
  }

  getTenantNotificationSubscriptions(tenantId: string) {
    return this.http.get(`/tenants/${tenantId}/notification-subscription-trees`);
  }

  setTenantReceivers(subscriptionId: string, revision: number, receivers: [string], receiversShow: [string]) {
    return this.http.post(`/notification-subscriptions/${subscriptionId}/receivers` + this.queryParse({ revision }), {
      receivers,
      receiversShow
    });
  }

  setCustomerReceivers(customerId: string, force: boolean, receivers: [string], receiversShow: [string]) {
    return this.http.post(`/notification-subscriptions/customers/${customerId}/receivers`, {
      receivers,
      receiversShow
    });
  }
}
