/* eslint-disable @typescript-eslint/no-namespace */
export namespace NotificationTemplateActions {
  export class GetAll {
    static readonly type = '[NotificationTemplate] Get All';
    constructor(
      public query?: {
        name?: string;
        disabled?: boolean;
        pageNo?: number;
        pageSize?: number;
        sortBy?: [string];
        keyword?: string;
        status?: boolean;
      }
    ) { }
  }

  export class GetOne {
    static readonly type = '[NotificationTemplate] Get One';
    constructor(public templateId: string, public languageCode?: string) { }
  }

  export class DeleteOne {
    static readonly type = '[NotificationTemplate] Delete One';
    constructor(public templateId: string, public revision: string) { }
  }

  export class UpdateOne {
    static readonly type = '[NotificationTemplate] Update One';
    constructor(
      public templateId: string,
      public revision: string,
      public patchData: {
        name?: string;
        description?: string;
        configurationId?: string;
        tagList?: string[];
        contents?: [
          {
            content?: string;
            contentType?: string;
            languageCode?: string;
            subject?: string;
          }
        ];
      }
    ) { }
  }

  export class CreateOne {
    static readonly type = '[NotificationTemplate] Create One';
    constructor(
      public data: {
        name: string;
        description?: string;
        configurationId?: string;
        tagList?: string[];
        contents?: [
          {
            content?: string;
            contentType?: string;
            languageCode?: string;
            subject?: string;
          }
        ];
      }
    ) { }
  }

  export class UpdateDisplayedColumns {
    static readonly type = '[NotificationTemplate] UpdateDisplayedColumns';
    constructor(public displayedColumns: string[]) { }
  }

  export class EnabledOne {
    static readonly type = '[NotificationTemplate] EnabledOne';
    constructor(public templateId: string, public revision: string) { }
  }

  export class DisabledOne {
    static readonly type = '[NotificationTemplate] DisabledOne';
    constructor(public templateId: string, public revision: string) { }
  }
}
