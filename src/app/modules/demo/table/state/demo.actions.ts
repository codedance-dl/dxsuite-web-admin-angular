import { RequestQueryParams } from '@api/models/data-result';

export namespace DemoActions {

  export class GetAll {
    static readonly type = '[Demo] Get All';
    constructor(public query?: RequestQueryParams) { }
  }

  export class DeleteOne {
    static readonly type = '[Demo] Delete One';
    constructor(public logsId: string) { }
  }

  export class UpdateDisplayedColumns {
    static readonly type = '[Demo] UpdateDisplayedColumns';
    constructor(public displayedColumns: string[]) {  }
  }
}
