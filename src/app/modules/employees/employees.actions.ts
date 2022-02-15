import { BaseQuery, EmployeeQuery } from '@api/models';

export namespace EmployeesActions {
  export class GetAll {
    static readonly type = '[Employees] Get All';
    constructor(public query?: Partial<EmployeeQuery>) {}
  }

  export class GetOne {
    static readonly type = '[Employees] Get One';
    constructor(public employeeId: string) {}
  }

  export class DeleteOne {
    static readonly type = '[Employees] Delete One';
    constructor(public userId: string, public revision: number) {}
  }

  export class UpdateDisplayedColumns {
    static readonly type = '[Employees] UpdateDisplayedColumns';
    constructor(public displayedColumns: string[]) {}
  }

  export class GetRoles {
    static readonly type = '[Employees] Get Roles';
    constructor(public query?: BaseQuery) {}
  }

  export class HandledError {
    static readonly type = '[Employees] Error Handling';
    constructor(public error: Partial<{message: string; code: string}>) {}
  }
  export class ResetPassword {
    static readonly type = '[Employees] Reset Password';
    constructor(public employeeId: string, public password: string) {}
  }
}
