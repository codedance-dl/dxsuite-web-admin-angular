export namespace I18nMessageActions {
  export class GetAll {
    static readonly type = '[Message] Get All';
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
    static readonly type = '[Message] Get One';
    constructor(public notificationId: string) {}
  }

  export class UpdateDisplayedColumns {
    static readonly type = '[Message] UpdateDisplayedColumns';
    constructor(public displayedColumns: string[]) {}
  }

  export class SetRead {
    static readonly type = '[Message] Set Read';
    constructor(public notificationIds: string[]) {}
  }
}
