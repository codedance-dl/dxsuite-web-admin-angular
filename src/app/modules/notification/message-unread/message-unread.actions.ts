/* eslint-disable @typescript-eslint/no-namespace */
export namespace MessageUnreadActions {
  export class GetAll {
    static readonly type = '[MessageUnread] Get All';
    constructor(
      public query?: {
        bizType?: string;
        isRead?: boolean;
        pageNo?: number;
        pageSize?: number;
        senderType?: string;
        sortBy?: [string];
      }
    ) {}
  }

  export class GetOne {
    static readonly type = '[MessageUnread] Get One';
    constructor(public notificationId: string) {}
  }

  export class UpdateDisplayedColumns {
    static readonly type = '[MessageUnread] UpdateDisplayedColumns';
    constructor(public displayedColumns: string[]) {}
  }

  export class SetRead {
    static readonly type = '[MessageUnread] Set Read';
    constructor(public notificationIds: string[]) {}
  }
}
