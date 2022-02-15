import { Observable } from 'rxjs';

import { Injectable, InjectionToken } from '@angular/core';

export interface GuardHandler<T> {

  /**  */
  setPrivilege?(privilegeValue: T[]): void;

  /**  */
  getPrivilege?(): T[] | Observable<T[]>;

  /**  */
  clearPrivilege?(): void;

  /**  */
  hasPrivilege(privilegeValue: T[]): boolean | Observable<boolean>;
}

@Injectable()
export class NoopGuardHandler implements GuardHandler<string> {

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  // setPrivilege() { }

  getPrivilege(): string[] | Observable<string[]> { return []; }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  // clearPrivilege() { }

  hasPrivilege(): boolean | Observable<boolean> { return true; }
}

export const GUARD_HANDLER = new InjectionToken<GuardHandler<unknown>>('guard-handler');
