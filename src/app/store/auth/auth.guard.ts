import { filter, take, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthState } from '@app/store/auth/auth.state';
import { Store } from '@ngxs/store';

import { AuthorizedRouteAccess, RejectedRouteAccess } from './auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private store: Store) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store
      .select(AuthState.isAuthenticated)
      .pipe(
        filter(() => this.store.selectSnapshot(AuthState.isVertifed)),
        take(1),
        tap(authenticated => this.store.dispatch(authenticated
          ? new AuthorizedRouteAccess()
          : new RejectedRouteAccess(state.url, true)
        ))
      );
  }
}
