import { RequestQueryParams } from '@api/models/data-result';
import { OperationsLogsModel } from '../data/operations-logs.model';

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
    constructor(public logsId: string, public patchData: Partial<OperationsLogsModel>) { }
  }

  export class UpdateDisplayedColumns {
    static readonly type = '[Logs] UpdateDisplayedColumns';
    constructor(public displayedColumns: string[]) {  }
  }

  export class GetControllerMethod {
    static readonly type = '[Logs] Get Controller Methods';
  }
}
