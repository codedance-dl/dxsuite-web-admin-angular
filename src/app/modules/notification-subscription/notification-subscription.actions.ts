import { NotificationSubscriptionTemplates } from './data/notification-subscription';

export namespace NotificationSubscriptions {
  export class Create {
    static readonly type = '[通知设置] 创建通知订阅模板';
    constructor(public submitData: NotificationSubscriptionTemplates, public groupName: string) {}
  }

  export class Update {
    static readonly type = '[通知设置] 更新通知订阅模板';
    constructor(public templateId: string, public submitData: Partial<NotificationSubscriptionTemplates>, public revision: number) {}
  }

  export class Delete {
    static readonly type = '[通知设置] 删除通知订阅模板';
    constructor(public templateId: string, public revision: number, public groupId: string) {}
  }

  export class Detail {
    static readonly type = '[通知设置] 取得通知订阅模板详情';
    constructor(public templateId: string) {}
  }

  export class Hierarchy {
    static readonly type = '[通知设置] 取得通知订阅模板层级结构';
    constructor(public category: string) {}
  }

  export class ChangeFoldStatus {
    static readonly type = '[通知设置]改变层级分组折叠状态';
    constructor(public groupId: string) {}
  }

  export class GetItemsHierarchy {
    static readonly type = '[通知设置] GetItemsHierarchy';
  }

  export class GetTemplateTrees {
    static readonly type = '[通知设置] GetTemplateTrees';
  }
}
