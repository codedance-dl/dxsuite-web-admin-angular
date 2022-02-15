import { switchMap } from 'rxjs/operators';
import { UserAuthService } from 'src/api/user-auth.service';

import { APP_INITIALIZER, Injectable, Provider } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofActionDispatched, Store } from '@ngxs/store';

import {
  ClearIdentity,
  RejectedRouteAccess,
  SetIdentity,
  VerifyToken
} from '../store/auth';
import { clearToken } from '@api';

@Injectable({
  providedIn: 'root'
})
export class AppStateHandler {

  constructor(
    private userAuthService: UserAuthService,
    private store: Store,
    private actions: Actions,
    private router: Router
  ) {

    this.actions
      .pipe(
        ofActionDispatched(VerifyToken),
        switchMap(() => this.userAuthService.getUser())
      )
      .subscribe(result => {
        this.store.dispatch(new SetIdentity(result));
      }, () => this.store.dispatch(new SetIdentity(null)));

    this.actions
      .pipe(ofActionDispatched(RejectedRouteAccess))
      .subscribe((res: RejectedRouteAccess) => {
        if (res.isUnauthorized) {
          this.router.navigate(['/login']);
        }
    });

    this.actions
      .pipe(ofActionDispatched(ClearIdentity))
      .subscribe(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('token_time');
        clearToken();
        this.router.navigate(['/login']);
      });
  }
}

// Noop handler for factory function
export function noop() {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return () => {};
}

export const APP_STATE_INITIALIZER: Provider = {
  provide: APP_INITIALIZER,
  useFactory: noop,
  deps: [AppStateHandler],
  multi: true
};
