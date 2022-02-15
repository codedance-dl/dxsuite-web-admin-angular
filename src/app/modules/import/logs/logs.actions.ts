import { ImportLogsQuery } from '@api/models';

export interface ProcessPayload {
  taskId: string;
  success: boolean;
  itemSuccess: boolean;
  totalCount: number;
  processedCount: number;
  failedCount: number;
}

export namespace LogsActions {

  export class GetAll {
    static readonly type = '[Logs] Get All';
    constructor(public query?: ImportLogsQuery) { }
  }

  export class UpdateImportProcess {
    static readonly type = '[Logs] UpdateImportProcess';
    constructor(public taskId: string, public payload: ProcessPayload) { }
  }

  export class UpdateDisplayedColumns {
    static readonly type = '[Logs] UpdateDisplayedColumns';
    constructor(public displayedColumns: string[]) { }
  }
}
