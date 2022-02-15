import { BaseQuery } from '@api/models';

export namespace AssetsActions {

  export class GetAll {
    static readonly type = '[Assets] Get All';
    constructor(public query?: BaseQuery) { }
  }

  export class UpdateDisplayedColumns {
    static readonly type = '[Assets] UpdateDisplayedColumns';
    constructor(public displayedColumns: string[]) { }
  }
}
