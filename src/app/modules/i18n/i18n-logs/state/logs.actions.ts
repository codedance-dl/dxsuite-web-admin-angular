import { RequestQueryParams } from '@api/models/data-result';

import { I18nLogsModel } from '../data/logs.model';

export namespace I18nLogsActions {

  export class GetAll {
    static readonly type = '[I18n Logs] Get All By User';
    constructor(public query?: RequestQueryParams) { }
  }

  export class GetOne {
    static readonly type = '[I18n Logs] Get One By User';
    constructor(public logsId: string) { }
  }

  export class DeleteOne {
    static readonly type = '[I18n Logs] Delete One';
    constructor(public logsId: string) { }
  }

  export class UpdateOne {
    static readonly type = '[I18n Logs] Update One';
    constructor(public logsId: string, public patchData: Partial<I18nLogsModel>) { }
  }

  export class UpdateDisplayedColumns {
    static readonly type = '[I18n Logs] UpdateDisplayedColumns';
    constructor(public displayedColumns: string[]) {  }
  }

  export class GetControllerMethod {
    static readonly type = '[I18n Logs] Get Controller Methods';
  }
}
