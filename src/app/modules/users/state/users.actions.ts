/* eslint-disable @typescript-eslint/no-namespace */
import { UsersQuery } from '../data/users.model';

export namespace UsersActions {
  export class GetAll {
    static readonly type = '[Users] Get All';
    constructor(public query?: UsersQuery) {}
  }
}
