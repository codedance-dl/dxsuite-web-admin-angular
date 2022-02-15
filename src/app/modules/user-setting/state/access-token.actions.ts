/* eslint-disable @typescript-eslint/no-namespace */
export namespace AccessTokenActions {
  export class GetAll {
    static readonly type = '[Access Token] Get All';
    constructor(public userId: string, public query?: {
      pageNo?: number;
      pageSize?: number;
      sortBy?: [string];
      userId?: string;
    }) {}
  }

  export class UpdateDisplayedColumns {
    static readonly type = '[Access Token] UpdateDisplayedColumns';
    constructor(public displayedColumns: string[]) {}
  }
}
