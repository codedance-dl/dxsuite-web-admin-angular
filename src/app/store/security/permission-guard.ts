/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { GUARD_HANDLER, GuardHandler } from './guard-handler';

@Injectable()
export class PermissionGuard<T> implements CanActivate {

  constructor(
    private router: Router,
    @Inject(GUARD_HANDLER) protected handler: GuardHandler<T>
  ) { }

  canActivate(route, state) {
    const constructor: { ROLE_KEY: T[] } = this.constructor as never;
    const hasPrivilege = this.handler.hasPrivilege(constructor.ROLE_KEY);
    if(!hasPrivilege) {
      return this.router.createUrlTree([`/unauthorized`], {
        queryParams: {
          origin_target: state.url
        }
      });
    }
    return hasPrivilege;
  }
}
