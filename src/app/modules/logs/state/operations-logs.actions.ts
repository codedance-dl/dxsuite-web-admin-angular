import { RequestQueryParams } from '@api/models/data-result';
import { LogsModel } from '@constant/common';

export namespace OperationsLogsActions {

  export class GetAll {
    static readonly type = '[Logs] Get All By User';
    constructor(public query?: RequestQueryParams) { }
  }

  export class GetOne {
    static readonly type = '[Logs] Get One By User';
    constructor(public logsId: string) { }
  }

  export class DeleteOne {
    static readonly type = '[Logs] Delete One';
    constructor(public logsId: string) { }
  }

  export class UpdateOne {
    static readonly type = '[Logs] Update One';
    constructor(public logsId: string, public patchData: Partial<LogsModel>) { }
  }

  export class UpdateDisplayedColumns {
    static readonly type = '[Logs] UpdateDisplayedColumns';
    constructor(public displayedColumns: string[]) {  }
  }

  export class GetControllerMethod {
    static readonly type = '[Logs] Get Controller Methods';
  }
}
